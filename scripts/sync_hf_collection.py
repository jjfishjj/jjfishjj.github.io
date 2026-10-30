#!/usr/bin/env python3
"""Synchronize the curated Hugging Face Collection from Portfolio Manifest."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from urllib.parse import urlparse

from huggingface_hub import HfApi, get_token


def hub_resource(url: str) -> tuple[str, str]:
    parts = [part for part in urlparse(url).path.split("/") if part]
    if len(parts) >= 3 and parts[0] in {"spaces", "datasets"}:
        item_type = "space" if parts[0] == "spaces" else "dataset"
        return f"{parts[1]}/{parts[2]}", item_type
    if len(parts) >= 2:
        return f"{parts[0]}/{parts[1]}", "model"
    raise ValueError(f"Unsupported Hugging Face resource URL: {url}")


def collection_slug(url: str) -> str:
    marker = "/collections/"
    path = urlparse(url).path
    if marker not in path:
        raise ValueError(f"Unsupported collection URL: {url}")
    return path.split(marker, 1)[1].strip("/")


def desired_items(manifest: dict) -> list[dict]:
    items = []
    seen = set()
    for artifact in manifest["artifacts"]:
        item_id, item_type = hub_resource(artifact["url"])
        key = (item_id, item_type)
        if key in seen:
            raise ValueError(f"Duplicate Hub resource in manifest: {item_type} {item_id}")
        seen.add(key)
        items.append({
            "item_id": item_id,
            "item_type": item_type,
            "note": artifact["summary"]["en"],
        })
    return items


def synchronize(manifest: dict, *, apply: bool, prune: bool, token: str | None) -> dict:
    api = HfApi(token=token)
    slug = collection_slug(manifest["collectionUrl"])
    desired = desired_items(manifest)
    collection = api.get_collection(slug, token=token)
    current = {(item.item_id, item.item_type): item for item in collection.items}
    desired_keys = [(item["item_id"], item["item_type"]) for item in desired]
    missing = [item for item in desired if (item["item_id"], item["item_type"]) not in current]
    stale = [item for key, item in current.items() if key not in set(desired_keys)]
    order_changed = [(item.item_id, item.item_type) for item in collection.items] != desired_keys

    plan = {
        "collection": slug,
        "desired": len(desired),
        "current": len(current),
        "missing": [f'{item["item_type"]}:{item["item_id"]}' for item in missing],
        "stale": [f"{item.item_type}:{item.item_id}" for item in stale],
        "orderChanged": order_changed,
        "applied": apply,
    }
    print(json.dumps(plan, indent=2, ensure_ascii=False))
    if not apply:
        return plan

    for item in missing:
        api.add_collection_item(slug, item["item_id"], item["item_type"], note=item["note"], exists_ok=True, token=token)
    if prune:
        for item in stale:
            api.delete_collection_item(slug, item.item_object_id, missing_ok=True, token=token)

    refreshed = api.get_collection(slug, token=token)
    refreshed_map = {(item.item_id, item.item_type): item for item in refreshed.items}
    for position, item in enumerate(desired):
        current_item = refreshed_map[(item["item_id"], item["item_type"])]
        api.update_collection_item(slug, current_item.item_object_id, note=item["note"], position=position, token=token)

    verified = api.get_collection(slug, token=token)
    final_keys = [(item.item_id, item.item_type) for item in verified.items]
    if final_keys != desired_keys:
        raise RuntimeError(f"Collection verification failed: expected {desired_keys}, got {final_keys}")
    print(f"Collection synchronized and verified: {len(final_keys)} items")
    return plan


def self_test() -> None:
    cases = {
        "https://huggingface.co/spaces/junbin666/demo": ("junbin666/demo", "space"),
        "https://huggingface.co/datasets/junbin666/data": ("junbin666/data", "dataset"),
        "https://huggingface.co/junbin666/model": ("junbin666/model", "model"),
    }
    for url, expected in cases.items():
        assert hub_resource(url) == expected
    assert collection_slug("https://huggingface.co/collections/user/name-123") == "user/name-123"
    print("HF Collection sync self-test passed")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", default="public/portfolio-manifest.json")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--prune", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return 0
    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    token = os.environ.get("HF_TOKEN") or get_token()
    if args.apply and not token:
        print("HF_TOKEN is required with --apply", file=sys.stderr)
        return 2
    synchronize(manifest, apply=args.apply, prune=args.prune, token=token)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
