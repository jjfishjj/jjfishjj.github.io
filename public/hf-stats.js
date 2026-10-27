const HF_OWNER = "junbin666";
const CACHE_KEY = "jjfishjj:hf-public-stats:v1";
const CACHE_TTL_MS = 60 * 60 * 1000;

const endpoints = {
  spaces: `https://huggingface.co/api/spaces?author=${HF_OWNER}&limit=100`,
  models: `https://huggingface.co/api/models?author=${HF_OWNER}&limit=100`,
  datasets: `https://huggingface.co/api/datasets?author=${HF_OWNER}&limit=100`,
};

function readCache(storage, allowExpired = false) {
  if (!storage) return null;
  try {
    const cached = JSON.parse(storage.getItem(CACHE_KEY));
    if (!cached?.data || !Number.isFinite(cached.savedAt)) return null;
    if (!allowExpired && Date.now() - cached.savedAt > CACHE_TTL_MS) return null;
    return { ...cached.data, source: "cache" };
  } catch {
    return null;
  }
}

function writeCache(storage, data) {
  if (!storage) return;
  try {
    storage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Storage can be unavailable in privacy mode; live data still works.
  }
}

async function fetchCount(fetchImpl, url) {
  const response = await fetchImpl(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Hugging Face API returned ${response.status}`);
  const items = await response.json();
  if (!Array.isArray(items)) throw new Error("Unexpected Hugging Face API response");
  return items.length;
}

export async function fetchHuggingFaceStats({
  fetchImpl = fetch,
  storage = typeof localStorage === "undefined" ? null : localStorage,
  force = false,
} = {}) {
  if (!force) {
    const cached = readCache(storage);
    if (cached) return cached;
  }

  try {
    const [spaces, models, datasets] = await Promise.all([
      fetchCount(fetchImpl, endpoints.spaces),
      fetchCount(fetchImpl, endpoints.models),
      fetchCount(fetchImpl, endpoints.datasets),
    ]);
    const data = {
      owner: HF_OWNER,
      spaces,
      models,
      datasets,
      total: spaces + models + datasets,
      fetchedAt: new Date().toISOString(),
      source: "live",
    };
    writeCache(storage, data);
    return data;
  } catch (error) {
    const stale = readCache(storage, true);
    if (stale) return { ...stale, source: "stale-cache" };
    throw error;
  }
}

export const huggingFaceStatsConfig = Object.freeze({ owner: HF_OWNER, endpoints });

globalThis.HFPortfolioStats = Object.freeze({
  fetchHuggingFaceStats,
  config: huggingFaceStatsConfig,
});
