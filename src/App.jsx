import { useState, useMemo } from 'react'
import './App.css'
import { SKILLS, CATS, PROJECTS } from './skills'

const CERTIFICATES = [
  {
    title: '透過 Jetson Nano 開發人工智慧應用',
    date: '2026.04.08',
    id: 'X7_8YnbdS1GKyHq0AQiJOw',
    pdf: '/certificates/nvidia-jetson-nano-ai-applications-2026-04-08.pdf',
  },
  {
    title: '深度學習基礎理論與實踐',
    date: '2026.04.09',
    id: '31eGXbB3QsqYNE16bf2kbw',
    pdf: '/certificates/nvidia-deep-learning-fundamentals-2026-04-09.pdf',
  },
  {
    title: '快速開發基於大型語言模型（LLM）的應用程式',
    date: '2026.04.23',
    id: 'BwdpSPNNRsOxUDhEZwSHmA',
    pdf: '/certificates/nvidia-rapid-llm-application-development-2026-04-23.pdf',
  },
  {
    title: '使用提示工程開發大型語言模型（LLM）應用程式',
    date: '2026.05.07',
    id: 'qPbpRP6xRVq6AWgeT78C4w',
    pdf: '/certificates/nvidia-prompt-engineering-llm-applications-2026-05-07.pdf',
  },
  {
    title: '建造以 Transformer 為基礎的自然語言處理應用',
    date: '2026.06.11',
    id: 'GJH8CNKhRiWig1f5WvXa6A',
    pdf: '/certificates/nvidia-transformer-nlp-applications-2026-06-11.pdf',
  },
]

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
        <div className="hero-actions">
          <a className="profile-link" href="/projects/">專案總覽</a>
          <a className="profile-link" href="/linkedin/">經歷儀表板</a>
          <a className="profile-link" href="/ai-prompt-game-tutorial/">AI 遊戲教學</a>
          <a className="profile-link" href="/lectures/">語言講座</a>
        </div>
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

        <section className="certificates">
          <div className="section-heading">
            <div>
              <span className="section-kicker">NVIDIA DEEP LEARNING INSTITUTE</span>
              <h2>NVIDIA 專業認證</h2>
            </div>
            <span className="cert-count">{CERTIFICATES.length} 張證書</span>
          </div>
          <div className="cert-grid">
            {CERTIFICATES.map((certificate) => (
              <article key={certificate.id} className="cert-card">
                <div className="cert-mark" aria-hidden="true">NVIDIA</div>
                <time className="cert-date" dateTime={certificate.date.replaceAll('.', '-')}>{certificate.date}</time>
                <h3>{certificate.title}</h3>
                <p>Certificate of Competency</p>
                <div className="cert-actions">
                  <a href={certificate.pdf} target="_blank" rel="noreferrer">查看證書 PDF ↗</a>
                  <a
                    href={`https://learn.nvidia.com/certificates?id=${certificate.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    NVIDIA 官方驗證 ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="projects">
          <h2>我的精選作品入口</h2>
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
          <a href="/projects/">Projects</a>
          {' · '}
          <a href="/linkedin/">Professional Profile</a>
          {' · '}
          <a href="/ai-prompt-game-tutorial/">AI Game Tutorial</a>
          {' · '}
          <a href="/lectures/">Lectures</a>
          {' · '}
          Data from{' '}
          <a href="https://github.com/nvidia/skills" target="_blank" rel="noreferrer">NVIDIA/skills</a>
        </p>
      </footer>
    </div>
  )
}
