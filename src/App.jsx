import { useEffect, useState, useMemo } from 'react'
import './App.css'
import { SKILLS, CATS, PROJECTS } from './skills'
import { CATEGORIES_EN, PROJECTS_EN, SKILLS_EN, TAGS_EN, UI } from './translations'

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

function CopyButton({ text, language }) {
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
      {copied ? UI[language].copied : UI[language].copy}
    </button>
  )
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get('lang')
    if (requested === 'en' || requested === 'zh') return requested
    return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'zh'
  })
  const copy = UI[language]
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [hfStats, setHfStats] = useState({ status: 'loading', data: null })
  const [portfolioManifest, setPortfolioManifest] = useState({ status: 'loading', data: null })

  useEffect(() => {
    localStorage.setItem('portfolio-language', language)
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant'
    document.title = copy.pageTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.pageDescription)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.pageTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.pageDescription)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'en' ? 'en_US' : 'zh_TW')
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', copy.pageTitle)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', copy.pageDescription)
  }, [language, copy])

  useEffect(() => {
    let active = true
    Promise.resolve()
      .then(() => globalThis.HFPortfolioStats.fetchHuggingFaceStats())
      .then((data) => {
        if (active) setHfStats({ status: 'ready', data })
      })
      .catch(() => {
        if (active) setHfStats({ status: 'unavailable', data: null })
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    fetch('/portfolio-manifest.json', { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error(`Manifest returned ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data.artifacts) || !Array.isArray(data.projects)) {
          throw new Error('Invalid portfolio manifest')
        }
        if (active) setPortfolioManifest({ status: 'ready', data })
      })
      .catch(() => {
        if (active) setPortfolioManifest({ status: 'unavailable', data: null })
      })
    return () => {
      active = false
    }
  }, [])

  const featuredArtifacts = useMemo(() => {
    if (!portfolioManifest.data) return []
    return portfolioManifest.data.artifacts
      .filter((artifact) => artifact.featuredOrder)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
  }, [portfolioManifest])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SKILLS.map((skill) => language === 'en'
      ? { ...skill, ...(SKILLS_EN[skill.skill] || {}) }
      : skill).filter((s) => {
      const matchCat = filter === 'all' || s.cat === filter
      const matchQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.skill.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.scenario.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [filter, query, language])

  return (
    <div className="page">
      <header className="hero">
        <button
          className="lang-toggle"
          type="button"
          aria-label={copy.languageLabel}
          onClick={() => {
            const nextLanguage = language === 'en' ? 'zh' : 'en'
            setLanguage(nextLanguage)
            const nextUrl = new URL(window.location.href)
            nextUrl.searchParams.set('lang', nextLanguage)
            window.history.replaceState({}, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`)
          }}
        >
          {copy.languageButton}
        </button>
        <div className="nv-badge">NVIDIA Agent Skills</div>
        <h1>{copy.heroTitle}</h1>
        <p className="hero-sub">{SKILLS.length}{copy.heroDescription}</p>
        <a className="hero-link" href="https://github.com/nvidia/skills" target="_blank" rel="noreferrer">
          github.com/nvidia/skills ↗
        </a>
        <div className="hero-actions">
          <a className="profile-link" href="/projects/">{copy.projectsOverview}</a>
          <a className="profile-link" href="/linkedin/">{copy.experienceDashboard}</a>
          <a className="profile-link hf-portfolio-link" href="https://huggingface.co/spaces/junbin666/nvidia-project-portfolio" target="_blank" rel="noreferrer">HF Portfolio ↗</a>
          <a className="profile-link" href="/portfolio-health/">Portfolio Health</a>
          <a className="profile-link" href="/ai-prompt-game-tutorial/">{copy.aiGameTutorial}</a>
          <a className="profile-link" href="/lectures/">{copy.languageLectures}</a>
          <a className="profile-link" href="https://jjfishjj.github.io/claude-projects-hub/" target="_blank" rel="noreferrer">{copy.deployIndex}</a>
        </div>
      </header>

      <main className="main">
        <section className="hf-showcase" aria-labelledby="hf-showcase-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">LIVE ON HUGGING FACE</span>
              <h2 id="hf-showcase-title">{copy.featuredWork}</h2>
            </div>
            <div className="hf-links">
              <a className="hf-profile featured" href="https://huggingface.co/spaces/junbin666/nvidia-project-portfolio" target="_blank" rel="noreferrer">
                {copy.projectsCount}
              </a>
              <a className="hf-profile" href="https://huggingface.co/junbin666" target="_blank" rel="noreferrer">
                @junbin666 ↗
              </a>
            </div>
          </div>
          <p className="section-intro">
            {copy.showcaseIntro}
          </p>
          <p className={`hf-live-stats ${hfStats.status}`} aria-live="polite">
            {hfStats.status === 'ready' && (
              <>
                {copy.hfStatsPrefix}<strong>{hfStats.data.spaces} Spaces</strong>
                <span>·</span><strong>{hfStats.data.models} Models</strong>
                <span>·</span><strong>{hfStats.data.datasets} {hfStats.data.datasets === 1 ? 'Dataset' : 'Datasets'}</strong>
                <span>·</span><strong>{hfStats.data.total} {copy.publicArtifacts}</strong>
              </>
            )}
            {hfStats.status === 'loading' && copy.statsLoading}
            {hfStats.status === 'unavailable' && copy.statsUnavailable}
          </p>
          <div className="hf-grid">
            {featuredArtifacts.map((item) => (
              <a key={item.id} className="hf-card" href={item.url} target="_blank" rel="noreferrer">
                <div className="hf-card-head">
                  <span className="hf-icon" aria-hidden="true">{item.icon}</span>
                  <span className="hf-kind">{item.type.toUpperCase()} · {item.tags[0]}</span>
                  <span className="proj-arrow">↗</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary[language] || item.summary.zh}</p>
                <code>{item.evidence[language] || item.evidence.zh}</code>
              </a>
            ))}
            {portfolioManifest.status === 'loading' && (
              <div className="hf-manifest-state">{copy.manifestLoading}</div>
            )}
            {portfolioManifest.status === 'unavailable' && (
              <div className="hf-manifest-state error">{copy.manifestUnavailable}</div>
            )}
          </div>
        </section>

        <div className="controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search"
              type="text"
              placeholder={copy.searchPlaceholder}
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
                {language === 'en' ? CATEGORIES_EN[c.id] : c.label}
              </button>
            ))}
            <span className="count">{filtered.length} {copy.allCases}</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="empty">{copy.noResultsStart}{query}{copy.noResultsEnd}</p>
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
                      <CopyButton text={s.cmd} language={language} />
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
              <h2>{copy.certificatesTitle}</h2>
            </div>
            <span className="cert-count">{CERTIFICATES.length} {copy.certificateCount}</span>
          </div>
          <div className="cert-grid">
            {CERTIFICATES.map((certificate, index) => (
              <article key={certificate.id} className="cert-card">
                <div className="cert-mark" aria-hidden="true">NVIDIA</div>
                <time className="cert-date" dateTime={certificate.date.replaceAll('.', '-')}>{certificate.date}</time>
                <h3>{language === 'en' ? copy[`cert${index + 1}`] : certificate.title}</h3>
                <p>Certificate of Competency</p>
                <div className="cert-actions">
                  <a href={certificate.pdf} target="_blank" rel="noreferrer">{copy.viewCertificate}</a>
                  <a
                    href={`https://learn.nvidia.com/certificates?id=${certificate.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {copy.verifyCertificate}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="projects">
          <h2>{copy.projectsTitle}</h2>
          <div className="proj-grid">
            {PROJECTS.map((p) => (
              <a key={p.url} className="proj-card" href={p.url} target="_blank" rel="noreferrer">
                <div className="proj-top">
                  <span className="proj-icon">{p.icon}</span>
                  <span className="proj-title">{language === 'en' ? PROJECTS_EN[p.title]?.title || p.title : p.title}</span>
                  <span className="proj-arrow">↗</span>
                </div>
                <p className="proj-desc">{language === 'en' ? PROJECTS_EN[p.title]?.desc || p.desc : p.desc}</p>
                <div className="proj-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="proj-tag">{language === 'en' ? TAGS_EN[t] || t : t}</span>
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
          <a href="/linkedin/">{copy.footerProfessionalProfile}</a>
          {' · '}
          <a href="https://huggingface.co/spaces/junbin666/nvidia-project-portfolio" target="_blank" rel="noreferrer">Hugging Face Portfolio</a>
          {' · '}
          <a href="/ai-prompt-game-tutorial/">{copy.footerGameTutorial}</a>
          {' · '}
          <a href="/lectures/">{copy.footerLectures}</a>
          {' · '}
          <a href="https://jjfishjj.github.io/claude-projects-hub/" target="_blank" rel="noreferrer">{copy.footerDeployHub}</a>
          {' · '}
          {copy.footerDataFrom}{' '}
          <a href="https://github.com/nvidia/skills" target="_blank" rel="noreferrer">NVIDIA/skills</a>
        </p>
      </footer>
    </div>
  )
}
