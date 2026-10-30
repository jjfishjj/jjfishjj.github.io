const elements = Object.fromEntries(['loading', 'error', 'empty', 'dashboard', 'latest-status', 'latest-links', 'latest-rate', 'history-count', 'updated-at', 'chart', 'run-list', 'failure-panel', 'failures'].map((id) => [id, document.getElementById(id)]))
const formatTime = (value) => new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Taipei' }).format(new Date(value))
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char])

function renderChart(runs) {
  const ordered = [...runs].reverse()
  const width = 900
  const height = 240
  const padding = 32
  const points = ordered.map((run, index) => {
    const x = ordered.length === 1 ? width / 2 : padding + (index / (ordered.length - 1)) * (width - padding * 2)
    const y = padding + ((100 - run.successRate) / 100) * (height - padding * 2)
    return { x, y, run }
  })
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')
  elements.chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><line x1="${padding}" x2="${width - padding}" y1="${padding}" y2="${padding}"/><line x1="${padding}" x2="${width - padding}" y1="${height - padding}" y2="${height - padding}"/><path d="${path}"/>${points.map((point) => `<circle class="${point.run.failed ? 'failed' : ''}" cx="${point.x}" cy="${point.y}" r="6"><title>${formatTime(point.run.checkedAt)} · ${point.run.successRate}%</title></circle>`).join('')}</svg><div class="chart-labels"><span>100%</span><span>0%</span></div>`
}

function render(history) {
  elements.loading.hidden = true
  if (!Array.isArray(history.runs) || history.runs.length === 0) {
    elements.empty.hidden = false
    return
  }
  const [latest] = history.runs
  elements.dashboard.hidden = false
  elements['latest-status'].textContent = latest.failed ? 'DEGRADED' : 'HEALTHY'
  elements['latest-status'].className = latest.failed ? 'bad' : 'good'
  elements['latest-links'].textContent = `${latest.healthy} / ${latest.total}`
  elements['latest-rate'].textContent = `${latest.successRate}%`
  elements['history-count'].textContent = history.runs.length
  elements['updated-at'].textContent = `更新於 ${formatTime(history.updatedAt)}`
  renderChart(history.runs)
  elements['run-list'].innerHTML = history.runs.map((run) => `<tr><td>${formatTime(run.checkedAt)}</td><td><span class="status ${run.failed ? 'bad' : 'good'}">${run.failed ? 'DEGRADED' : 'HEALTHY'}</span></td><td>${run.healthy} / ${run.total}</td><td>${run.successRate}%</td><td>${(run.durationMs / 1000).toFixed(1)}s</td><td>${run.runUrl ? `<a href="${escapeHtml(run.runUrl)}">Actions ↗</a>` : 'Local seed'}</td></tr>`).join('')
  if (latest.failures.length === 0) {
    elements.failures.innerHTML = '<div class="all-clear">✓ 最新一次檢查沒有失敗連結</div>'
  } else {
    elements.failures.innerHTML = latest.failures.map((failure) => `<article class="failure"><span>${escapeHtml(failure.status || 'ERR')}</span><a href="${escapeHtml(failure.url)}">${escapeHtml(failure.url)}</a><small>${escapeHtml(failure.error || failure.kinds.join(', '))}</small></article>`).join('')
  }
}

fetch('history.json', { cache: 'no-store' })
  .then((response) => { if (!response.ok) throw new Error(`History returned ${response.status}`); return response.json() })
  .then(render)
  .catch((error) => { console.error(error); elements.loading.hidden = true; elements.error.hidden = false })
