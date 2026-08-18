import { useEffect, useMemo, useState } from 'react'
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

const FAVORITES_KEY = 'jjfishjj:nvidia-skills:favorites'
const COMPARE_KEY = 'jjfishjj:nvidia-skills:compare'

function readStoredArray(key) {
  try {
    const value = window.localStorage.getItem(key)
    const parsed = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function categoryLabel(id) {
  return CATS.find((category) => category.id === id)?.label || id
}

function detailFor(skill) {
  return {
    tags: skill.tags || [categoryLabel(skill.cat), 'NVIDIA Skills'],
    level: skill.level || '探索',
    focus: skill.focus || `以 ${categoryLabel(skill.cat)} 的實務場景理解 ${skill.title}。`,
    outcomes: skill.outcomes || ['理解核心工作流程', '建立可重複的操作步驟', '找到適合延伸的實作方向'],
    prerequisites: skill.prerequisites || '建議先具備 Python、Linux 與 GPU/AI 基礎，再依官方文件補齊環境設定。',
  }
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className={`copy-btn ${copied ? 'copied' : ''}`}
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1800)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? '✓ 已複製' : '複製指令'}
    </button>
  )
}

function SkillDetail({ skill, onClose, onToggleFavorite, isFavorite }) {
  const detail = detailFor(skill)

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <article className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="skill-detail-title" onClick={(event) => event.stopPropagation()}>
        <div className="detail-header">
          <div>
            <span className="detail-kicker">{categoryLabel(skill.cat)} · {detail.level}</span>
            <h2 id="skill-detail-title"><span>{skill.icon}</span>{skill.title}</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="關閉案例詳細頁">✕</button>
        </div>
        <p className="detail-desc">{skill.desc}</p>
        <div className="detail-columns">
          <div>
            <div className="detail-block">
              <span className="detail-label">使用情境</span>
              <p>{skill.scenario}</p>
            </div>
            <div className="detail-block">
              <span className="detail-label">實作重點</span>
              <p>{detail.focus}</p>
            </div>
            <div className="detail-block">
              <span className="detail-label">建議先備</span>
              <p>{detail.prerequisites}</p>
            </div>
          </div>
          <div className="detail-side">
            <div className="detail-block">
              <span className="detail-label">預期成果</span>
              <ul className="outcome-list">
                {detail.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
              </ul>
            </div>
            <div className="tag-row detail-tags">
              {detail.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
          </div>
        </div>
        <div className="detail-command">
          <div>
            <span className="detail-label">快速啟用指令</span>
            <code>{skill.cmd}</code>
          </div>
          <CopyButton text={skill.cmd} />
        </div>
        <div className="detail-actions">
          <button className={`action-btn ${isFavorite ? 'active' : ''}`} type="button" onClick={() => onToggleFavorite(skill.skill)}>
            {isFavorite ? '★ 已收藏' : '☆ 加入收藏'}
          </button>
          <a className="action-btn primary" href={`https://github.com/NVIDIA/skills/tree/main/skills/${skill.skill}`} target="_blank" rel="noreferrer">
            查看 NVIDIA Skill ↗
          </a>
        </div>
      </article>
    </div>
  )
}

function CompareModal({ skills, onClose, onRemove }) {
  const rows = [
    ['分類', (skill) => categoryLabel(skill.cat)],
    ['難度', (skill) => detailFor(skill).level],
    ['實作重點', (skill) => detailFor(skill).focus],
    ['預期成果', (skill) => detailFor(skill).outcomes.join('、')],
  ]

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <article className="compare-modal" role="dialog" aria-modal="true" aria-labelledby="compare-title" onClick={(event) => event.stopPropagation()}>
        <div className="detail-header">
          <div>
            <span className="detail-kicker">Decision workspace</span>
            <h2 id="compare-title">案例比較</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="關閉比較視窗">✕</button>
        </div>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>比較面向</th>
                {skills.map((skill) => (
                  <th key={skill.skill}>
                    <span>{skill.icon}</span>{skill.title}
                    <button type="button" onClick={() => onRemove(skill.skill)}>移除</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, getValue]) => (
                <tr key={label}>
                  <th>{label}</th>
                  {skills.map((skill) => <td key={skill.skill}>{getValue(skill)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}

export default function App() {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [selectedSkillId, setSelectedSkillId] = useState(() => new URLSearchParams(window.location.search).get('skill'))
  const [favoriteIds, setFavoriteIds] = useState(() => readStoredArray(FAVORITES_KEY))
  const [compareIds, setCompareIds] = useState(() => readStoredArray(COMPARE_KEY))
  const [showCompare, setShowCompare] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SKILLS.filter((skill) => {
      const searchable = [skill.title, skill.skill, skill.desc, skill.scenario, skill.cat, ...(skill.tags || [])].join(' ').toLowerCase()
      const matchCat = filter === 'all' || skill.cat === filter
      return matchCat && (!q || searchable.includes(q))
    })
  }, [filter, query])

  const categoryStats = useMemo(() => CATS.filter((category) => category.id !== 'all').map((category) => ({
    ...category,
    count: SKILLS.filter((skill) => skill.cat === category.id).length,
  })), [])

  const topCategory = categoryStats.reduce((top, category) => category.count > top.count ? category : top, { label: '—', count: 0 })
  const compareSkills = compareIds.map((id) => SKILLS.find((skill) => skill.skill === id)).filter(Boolean)
  const selectedSkill = SKILLS.find((skill) => skill.skill === selectedSkillId)

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  useEffect(() => {
    window.localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds))
  }, [compareIds])

  useEffect(() => {
    const syncSkillFromUrl = () => setSelectedSkillId(new URLSearchParams(window.location.search).get('skill'))
    window.addEventListener('popstate', syncSkillFromUrl)
    return () => window.removeEventListener('popstate', syncSkillFromUrl)
  }, [])

  function openDetail(skillId) {
    setSelectedSkillId(skillId)
    window.history.pushState({}, '', `${window.location.pathname}?skill=${encodeURIComponent(skillId)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeDetail() {
    setSelectedSkillId(null)
    window.history.pushState({}, '', window.location.pathname)
  }

  function toggleFavorite(skillId) {
    setFavoriteIds((current) => current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId])
  }

  function toggleCompare(skillId) {
    setCompareIds((current) => {
      if (current.includes(skillId)) return current.filter((id) => id !== skillId)
      if (current.length >= 3) return current
      return [...current, skillId]
    })
  }

  return (
    <div className="page">
      <div className="site-topbar">
        <div className="topbar-inner">
          <a className="brand" href="/">jjfishjj <span>/ NVIDIA Skills</span></a>
          <nav className="site-nav" aria-label="主要連結">
            <a className="current" href="/">案例庫</a>
            <a href="/projects/">作品集</a>
            <a href="/linkedin/">經歷儀表板</a>
            <a href="/lectures/">講座</a>
          </nav>
        </div>
      </div>

      <header className="hero">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-content">
          <div className="nv-badge">NVIDIA Agent Skills · Field Guide</div>
          <h1>把 AI 能力拆成<br /><span>可以行動的案例。</span></h1>
          <p className="hero-sub">
            {SKILLS.length} 個精選案例，涵蓋 GPU 計算、LLM 訓練、推論部署、Agent Safety、醫療與視覺 AI，讓你從問題情境直接找到下一個實作步驟。
          </p>
          <div className="hero-actions">
            <a className="profile-link primary" href="#case-dashboard">探索統計儀表板</a>
            <a className="profile-link" href="/projects/">查看作品集</a>
            <a className="profile-link" href="https://github.com/NVIDIA/skills" target="_blank" rel="noreferrer">NVIDIA/skills ↗</a>
          </div>
          <div className="hero-pills" aria-label="案例摘要">
            <span><strong>{SKILLS.length}</strong> cases</span>
            <span><strong>{CATS.length - 1}</strong> tracks</span>
            <span><strong>{favoriteIds.length}</strong> saved</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="controls" aria-label="案例搜尋與篩選">
          <div className="section-intro">
            <div>
              <span className="section-kicker">CASE LIBRARY</span>
              <h2>從技術名詞，走到實際場景</h2>
            </div>
            <p>使用搜尋、分類、收藏與比較工具，建立屬於自己的 NVIDIA 技術閱讀路徑。</p>
          </div>
          <div className="search-wrap">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              className="search"
              type="search"
              placeholder="搜尋 skill、關鍵字、場景或技術…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="搜尋 skill、關鍵字、場景或技術"
            />
            {query && <button className="search-clear" type="button" onClick={() => setQuery('')} aria-label="清除搜尋">✕</button>}
          </div>
          <div className="filter-bar">
            {CATS.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${filter === category.id ? 'active' : ''}`}
                type="button"
                onClick={() => setFilter(category.id)}
              >
                {category.label}
                {category.id !== 'all' && <small>{categoryStats.find((stat) => stat.id === category.id)?.count}</small>}
              </button>
            ))}
            <span className="count">顯示 {filtered.length} / {SKILLS.length}</span>
          </div>
        </section>

        <section className="analytics" id="case-dashboard" aria-labelledby="dashboard-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SKILL LANDSCAPE</span>
              <h2 id="dashboard-title">案例統計儀表板</h2>
            </div>
            <p>以目前案例資料計算的技術分布；收藏與比較狀態會保留在此瀏覽器。</p>
          </div>
          <div className="metric-grid">
            <article className="metric-card accent-green"><span className="metric-label">案例總數</span><strong>{SKILLS.length}</strong><span>可搜尋的實務情境</span></article>
            <article className="metric-card accent-blue"><span className="metric-label">技術路線</span><strong>{CATS.length - 1}</strong><span>從 GPU 到 Agent Safety</span></article>
            <article className="metric-card accent-gold"><span className="metric-label">目前收藏</span><strong>{favoriteIds.length}</strong><span>你的個人閱讀清單</span></article>
            <article className="metric-card accent-violet"><span className="metric-label">最高密度分類</span><strong>{topCategory.count}</strong><span>{topCategory.label} 案例</span></article>
          </div>
          <div className="dashboard-grid">
            <div className="dashboard-panel">
              <div className="panel-heading"><h3>技術路線分布</h3><span>case count</span></div>
              <div className="bar-list">
                {categoryStats.map((category) => (
                  <div className="bar-row" key={category.id}>
                    <span>{category.label}</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(8, (category.count / topCategory.count) * 100)}%` }} /></div>
                    <strong>{category.count}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-panel dashboard-note">
              <span className="panel-index">01 / FIELD NOTE</span>
              <h3>把收藏變成下一步</h3>
              <p>先收藏感興趣的案例，再選最多三個案例進行比較。詳細頁會補上實作重點、先備條件、預期成果與一鍵啟用指令。</p>
              <a href="#case-grid">開始瀏覽案例 ↓</a>
            </div>
          </div>
        </section>

        <section id="case-grid" className="case-section" aria-labelledby="case-grid-title">
          <div className="section-heading compact">
            <div>
              <span className="section-kicker">EXPLORE CASES</span>
              <h2 id="case-grid-title">案例資料庫</h2>
            </div>
            <div className="view-tools">
              <span className="saved-count">★ {favoriteIds.length} 已收藏</span>
              <button className="text-btn" type="button" onClick={() => setFavoriteIds([])} disabled={!favoriteIds.length}>清除收藏</button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty"><strong>找不到相符案例</strong><span>沒有符合「{query}」的內容，試試其他關鍵字或清除分類。</span><button type="button" onClick={() => { setQuery(''); setFilter('all') }}>重設篩選</button></div>
          ) : (
            <div className="grid">
              {filtered.map((skill) => {
                const detail = detailFor(skill)
                const isFavorite = favoriteIds.includes(skill.skill)
                const isCompared = compareIds.includes(skill.skill)
                return (
                  <article key={skill.skill} className={`card ${expanded === skill.skill ? 'open' : ''}`}>
                    <button className="card-top" type="button" onClick={() => setExpanded(expanded === skill.skill ? null : skill.skill)} aria-expanded={expanded === skill.skill}>
                      <span className="card-icon">{skill.icon}</span>
                      <span className="card-info"><span className="card-title">{skill.title}</span><span className="card-desc">{skill.desc}</span></span>
                      <span className="chevron">{expanded === skill.skill ? '▲' : '▼'}</span>
                    </button>
                    <div className="card-meta"><span className="mini-tag">{categoryLabel(skill.cat)}</span><span className="level-dot">{detail.level}</span></div>
                    {expanded === skill.skill && (
                      <div className="card-body">
                        <p className="scenario">{skill.scenario}</p>
                        <p className="card-focus"><strong>Focus</strong>{detail.focus}</p>
                        <div className="cmd-row"><code className="cmd">{skill.cmd}</code><CopyButton text={skill.cmd} /></div>
                      </div>
                    )}
                    <div className="card-actions">
                      <button className={`icon-action ${isFavorite ? 'active' : ''}`} type="button" onClick={() => toggleFavorite(skill.skill)} aria-label={isFavorite ? `取消收藏 ${skill.title}` : `收藏 ${skill.title}`}>{isFavorite ? '★ 已收藏' : '☆ 收藏'}</button>
                      <button className={`icon-action ${isCompared ? 'active' : ''}`} type="button" onClick={() => toggleCompare(skill.skill)} aria-label={isCompared ? `從比較移除 ${skill.title}` : `加入比較 ${skill.title}`}>{isCompared ? '✓ 比較中' : '+ 比較'}</button>
                      <button className="detail-link" type="button" onClick={() => openDetail(skill.skill)}>查看詳細 ↗</button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="certificates">
          <div className="section-heading">
            <div><span className="section-kicker">NVIDIA DEEP LEARNING INSTITUTE</span><h2>NVIDIA 專業認證</h2></div>
            <span className="cert-count">{CERTIFICATES.length} 張證書</span>
          </div>
          <div className="cert-grid">
            {CERTIFICATES.map((certificate) => (
              <article key={certificate.id} className="cert-card">
                <div className="cert-mark">NVIDIA</div>
                <time className="cert-date" dateTime={certificate.date.replaceAll('.', '-')}>{certificate.date}</time>
                <h3>{certificate.title}</h3>
                <p>Certificate of Competency</p>
                <div className="cert-actions"><a href={certificate.pdf} target="_blank" rel="noreferrer">查看證書 PDF ↗</a><a href={`https://learn.nvidia.com/certificates?id=${certificate.id}`} target="_blank" rel="noreferrer">NVIDIA 官方驗證 ↗</a></div>
              </article>
            ))}
          </div>
        </section>

        <section className="projects">
          <div className="section-heading"><div><span className="section-kicker">SELECTED WORK</span><h2>我的精選作品入口</h2></div><a className="section-link" href="/projects/">瀏覽完整作品集 ↗</a></div>
          <div className="proj-grid">
            {PROJECTS.map((project) => (
              <a key={project.url} className="proj-card" href={project.url} target={project.url.startsWith('http') ? '_blank' : undefined} rel={project.url.startsWith('http') ? 'noreferrer' : undefined}>
                <div className="proj-top"><span className="proj-icon">{project.icon}</span><span className="proj-title">{project.title}</span><span className="proj-arrow">↗</span></div>
                <p className="proj-desc">{project.desc}</p>
                <div className="proj-tags">{project.tags.map((tag) => <span key={tag} className="proj-tag">{tag}</span>)}</div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer"><p>Built by <a href="https://github.com/jjfishjj" target="_blank" rel="noreferrer">@jjfishjj</a><span> · </span><a href="/projects/">Projects</a><span> · </span><a href="/linkedin/">Professional Profile</a><span> · </span><a href="/lectures/">Lectures</a><span> · </span>Data from <a href="https://github.com/NVIDIA/skills" target="_blank" rel="noreferrer">NVIDIA/skills</a></p></footer>

      {compareIds.length > 0 && (
        <div className="compare-tray" role="region" aria-label="案例比較工具">
          <div><strong>{compareIds.length} 個案例正在比較</strong><span>最多可選 3 個案例</span></div>
          <div className="compare-tray-actions"><button className="text-btn" type="button" onClick={() => setCompareIds([])}>清除</button><button className="compare-btn" type="button" onClick={() => setShowCompare(true)}>開啟比較 ↗</button></div>
        </div>
      )}

      {selectedSkill && <SkillDetail skill={selectedSkill} onClose={closeDetail} onToggleFavorite={toggleFavorite} isFavorite={favoriteIds.includes(selectedSkill.skill)} />}
      {showCompare && <CompareModal skills={compareSkills} onClose={() => setShowCompare(false)} onRemove={toggleCompare} />}
    </div>
  )
}
