#!/usr/bin/env node

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const DEFAULT_MANIFEST = 'public/portfolio-manifest.json'

export function validateManifest(manifest) {
  if (manifest?.schemaVersion !== 1) throw new Error('Manifest schemaVersion must be 1')
  for (const key of ['categories', 'artifacts', 'projects']) {
    if (!Array.isArray(manifest[key]) || manifest[key].length === 0) throw new Error(`Manifest ${key} must be a non-empty array`)
  }
  for (const key of ['artifacts', 'projects']) {
    const ids = manifest[key].map((item) => item.id)
    if (ids.some((id) => !id) || new Set(ids).size !== ids.length) throw new Error(`${key} must have unique, non-empty ids`)
  }
  const categoryIds = new Set(manifest.categories.map((item) => item.id))
  const unknownCategory = manifest.projects.find((project) => !categoryIds.has(project.category))
  if (unknownCategory) throw new Error(`Unknown category ${unknownCategory.category} on ${unknownCategory.id}`)
  const artifactIds = new Set(manifest.artifacts.map((item) => item.id))
  const unknownFeatured = manifest.recruiter?.featuredArtifactIds?.find((id) => !artifactIds.has(id))
  if (unknownFeatured) throw new Error(`Unknown featured artifact id: ${unknownFeatured}`)
  const skillIds = manifest.recruiter?.skills?.map((item) => item.id) || []
  if (new Set(skillIds).size !== skillIds.length) throw new Error('Recruiter skills must have unique ids')
  return manifest
}

export function collectLinks(manifest) {
  const links = [
    ['collection', manifest.collectionUrl],
    ...Object.entries(manifest.owner || {}).filter(([, value]) => /^https?:/.test(value)).map(([key, value]) => [`owner.${key}`, value]),
    ...manifest.artifacts.flatMap((item) => [['artifact', item.url], ['artifact source', item.sourceUrl]]),
    ...manifest.projects.flatMap((item) => [['project demo', item.demoUrl], ['project repo', item.repoUrl]])
  ].filter(([, url]) => /^https?:/.test(url || ''))

  const unique = new Map()
  for (const [kind, url] of links) {
    const entry = unique.get(url) || { url, kinds: new Set() }
    entry.kinds.add(kind)
    unique.set(url, entry)
  }
  return [...unique.values()].map((entry) => ({ url: entry.url, kinds: [...entry.kinds].sort() }))
}

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))

export async function checkLink(link, { fetchImpl = fetch, retries = 2, timeoutMs = 15000 } = {}) {
  let last = { ok: false, status: 0, error: 'unknown error' }
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetchImpl(link.url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { Accept: 'text/html,application/json;q=0.9,*/*;q=0.8', Range: 'bytes=0-0', 'User-Agent': 'portfolio-link-checker/1.0' }
      })
      response.body?.cancel?.()
      last = { ...link, ok: response.status >= 200 && response.status < 400, status: response.status, error: '' }
      if (last.ok) return last
      if (![408, 425, 429, 500, 502, 503, 504].includes(response.status)) return last
    } catch (error) {
      last = { ...link, ok: false, status: 0, error: error.name === 'AbortError' ? `timeout after ${timeoutMs}ms` : error.message }
    } finally {
      clearTimeout(timeout)
    }
    if (attempt < retries) await delay(750 * (attempt + 1))
  }
  return last
}

export async function checkLinks(links, options = {}) {
  const concurrency = Math.max(1, Number(options.concurrency || 5))
  const results = new Array(links.length)
  let nextIndex = 0
  async function worker() {
    while (nextIndex < links.length) {
      const index = nextIndex++
      results[index] = await checkLink(links[index], options)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, links.length) }, worker))
  return results
}

function parseArgs(argv) {
  const options = { manifest: DEFAULT_MANIFEST, retries: 2, timeoutMs: 15000, concurrency: 5, dryRun: false, selfTest: false, historyFile: '', runUrl: '' }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--manifest') options.manifest = argv[++index]
    else if (argument === '--retries') options.retries = Number(argv[++index])
    else if (argument === '--timeout') options.timeoutMs = Number(argv[++index])
    else if (argument === '--concurrency') options.concurrency = Number(argv[++index])
    else if (argument === '--history-file') options.historyFile = argv[++index]
    else if (argument === '--run-url') options.runUrl = argv[++index]
    else if (argument === '--dry-run') options.dryRun = true
    else if (argument === '--self-test') options.selfTest = true
    else throw new Error(`Unknown argument: ${argument}`)
  }
  return options
}

export function createHealthSnapshot(results, { checkedAt = new Date().toISOString(), runUrl = '', durationMs = 0 } = {}) {
  const failures = results.filter((result) => !result.ok)
  const healthy = results.length - failures.length
  return {
    checkedAt,
    runUrl,
    total: results.length,
    healthy,
    failed: failures.length,
    successRate: results.length ? Number(((healthy / results.length) * 100).toFixed(2)) : 0,
    durationMs,
    failures: failures.map(({ url, status, error, kinds }) => ({ url, status, error, kinds }))
  }
}

export async function appendHealthHistory(file, snapshot, { limit = 52 } = {}) {
  const target = resolve(process.cwd(), file)
  let history = { schemaVersion: 1, updatedAt: snapshot.checkedAt, runs: [] }
  try {
    history = JSON.parse(await readFile(target, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (history.schemaVersion !== 1 || !Array.isArray(history.runs)) throw new Error('Unsupported health history format')
  history.updatedAt = snapshot.checkedAt
  history.runs = [snapshot, ...history.runs.filter((run) => run.checkedAt !== snapshot.checkedAt)].slice(0, limit)
  await mkdir(dirname(target), { recursive: true })
  const temporary = `${target}.tmp`
  await writeFile(temporary, `${JSON.stringify(history, null, 2)}\n`, 'utf8')
  await rename(temporary, target)
  return history
}

async function runSelfTest() {
  const fixture = validateManifest({
    schemaVersion: 1,
    categories: [{ id: 'test' }],
    artifacts: [{ id: 'artifact', url: 'https://example.test/ok', sourceUrl: 'https://example.test/missing' }],
    projects: [{ id: 'project', category: 'test', demoUrl: 'https://example.test/ok', repoUrl: 'https://example.test/missing' }]
  })
  const links = collectLinks(fixture)
  const mockFetch = async (url) => new Response('', { status: url.endsWith('/ok') ? 200 : 404 })
  const results = await checkLinks(links, { fetchImpl: mockFetch, retries: 0, concurrency: 2 })
  if (links.length !== 2 || results.filter((result) => !result.ok).length !== 1) throw new Error('Self-test assertion failed')
  console.log('Self-test passed: validation, URL deduplication, success, and failure paths')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.selfTest) return runSelfTest()
  const path = resolve(process.cwd(), options.manifest)
  const manifest = validateManifest(JSON.parse(await readFile(path, 'utf8')))
  const links = collectLinks(manifest)
  console.log(`Manifest valid: ${manifest.projects.length} projects, ${manifest.artifacts.length} artifacts, ${links.length} unique URLs`)
  if (options.dryRun) return
  const startedAt = Date.now()
  const results = await checkLinks(links, options)
  const failures = results.filter((result) => !result.ok)
  const snapshot = createHealthSnapshot(results, { runUrl: options.runUrl, durationMs: Date.now() - startedAt })
  if (options.historyFile) {
    const history = await appendHealthHistory(options.historyFile, snapshot)
    console.log(`Health history updated: ${options.historyFile} (${history.runs.length} runs retained)`)
  }
  console.table(results.map((result) => ({ status: result.status || 'ERR', kind: result.kinds.join(', '), url: result.url })))
  if (failures.length) {
    console.error(`\n${failures.length} link(s) failed:`)
    failures.forEach((result) => console.error(`- ${result.status || 'ERR'} ${result.url}${result.error ? ` — ${result.error}` : ''}`))
    process.exitCode = 1
  } else {
    console.log(`All ${results.length} links are healthy.`)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
}
