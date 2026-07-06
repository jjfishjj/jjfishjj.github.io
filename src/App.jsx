import { useState, useMemo } from 'react'
import './App.css'
import { SKILLS, CATS, PROJECTS } from './skills'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className={`copy-btn ${copied ? 'copied' : ''}`}
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      }}
    >
      {copied ? '✓ 已複製' : '複製'}
    </button>
  )
}

export default function App() {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SKILLS.filter((s) => {
      const matchCat = filter === 'all' || s.cat === filter
      const matchQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.skill.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.scenario.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [filter, query])

  return (
    <div className="page">
      <header className="hero">
        <div className="nv-badge">NVIDIA Agent Skills</div>
        <h1>實際應用案例展示</h1>
        <p className="hero-sub">
          {SKILLS.length} 個精選案例，涵蓋 GPU 計算、LLM 訓練、推論部署、醫療與視覺 AI —
          教 AI agent 如何最佳地使用 NVIDIA 軟體
        </p>
        <a className="hero-link" href="https://github.com/nvidia/skills" target="_blank" rel="noreferrer">
          github.com/nvidia/skills ↗
        </a>
      </header>

      <main className="main">
        <div className="controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search"
              type="text"
              placeholder="搜尋 skill、關鍵字或場景…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')}>✕</button>
            )}
          </div>

          <div className="filter-bar">
            {CATS.map((c) => (
              <button
                key={c.id}
                className={`filter-btn ${filter === c.id ? 'active' : ''}`}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
            <span className="count">{filtered.length} 個案例</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="empty">沒有符合「{query}」的案例，試試其他關鍵字。</p>
        ) : (
          <div className="grid">
            {filtered.map((s) => (
              <div
                key={s.skill}
                className={`card ${expanded === s.skill ? 'open' : ''}`}
                onClick={() => setExpanded(expanded === s.skill ? null : s.skill)}
              >
                <div className="card-top">
                  <span className="card-icon">{s.icon}</span>
                  <div className="card-info">
                    <div className="card-title">{s.title}</div>
                    <div className="card-desc">{s.desc}</div>
                  </div>
                  <span className="chevron">{expanded === s.skill ? '▲' : '▼'}</span>
                </div>
                {expanded === s.skill && (
                  <div className="card-body" onClick={(e) => e.stopPropagation()}>
                    <p className="scenario">{s.scenario}</p>
                    <div className="cmd-row">
                      <code className="cmd">{s.cmd}</code>
                      <CopyButton text={s.cmd} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <section className="projects">
          <h2>我的 NVIDIA 相關作品</h2>
          <div className="proj-grid">
            {PROJECTS.map((p) => (
              <a key={p.url} className="proj-card" href={p.url} target="_blank" rel="noreferrer">
                <div className="proj-top">
                  <span className="proj-icon">{p.icon}</span>
                  <span className="proj-title">{p.title}</span>
                  <span className="proj-arrow">↗</span>
                </div>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="proj-tag">{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Built by{' '}
          <a href="https://github.com/jjfishjj" target="_blank" rel="noreferrer">@jjfishjj</a>
          {' · '}
          Data from{' '}
          <a href="https://github.com/nvidia/skills" target="_blank" rel="noreferrer">NVIDIA/skills</a>
        </p>
      </footer>
    </div>
  )
}
