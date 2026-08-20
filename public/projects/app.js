const categories = [
  {
    id: "all",
    title: "全部專案",
    short: "總覽",
    intro: "把目前公開作品、網站內 demo、GitHub repositories 與學習/研究題目集中整理。",
  },
  {
    id: "ai-nvidia",
    title: "AI / NVIDIA / Agent Infrastructure",
    short: "AI / NVIDIA",
    intro: "NVIDIA 技術棧、RAG、NIM、NeMo、Agent workflow、GPU acceleration 與 AI 產品化方向。",
  },
  {
    id: "digital-twin-3d",
    title: "3D / Digital Twin / Game Interaction",
    short: "3D / 遊戲",
    intro: "Omniverse、OpenUSD、互動式 3D 場景、校園導覽、遊戲化履歷與模擬展示。",
  },
  {
    id: "language-learning",
    title: "Language Learning / Education",
    short: "語言學習",
    intro: "Memolingua、Fluent AI、團塊法、拼寫記憶術、AI prompt 遊戲教學與講座內容。",
  },
  {
    id: "data-dashboard",
    title: "Data Analytics / Dashboard",
    short: "資料儀表板",
    intro: "營運看板、提案儀表板、學習營運、遊戲數據與成本分析等決策型展示。",
  },
  {
    id: "product-prototype",
    title: "Product Prototype / Web App",
    short: "產品原型",
    intro: "社群平台、表單工具、AI connector、LINE assistant、合作提案 demo 與網站型 MVP。",
  },
  {
    id: "research-hardware",
    title: "Research / Hardware / Robotics",
    short: "研究硬體",
    intro: "IC power efficiency、Jetson、robot arm、GPU power reduction 與硬體/機器人相關研究。",
  },
]

const projects = [
  {
    title: "NVIDIA Agent Skill Labs",
    category: "ai-nvidia",
    type: "Portfolio Map",
    description: "55 個 NVIDIA Agent Skills 案例與 8 個精選 README 方向，整理成可搜尋、可展示、可放履歷的技術作品集。",
    tags: ["NVIDIA Skills", "LLM", "GPU", "Portfolio"],
    demo: "/nvidia-agent-skill-labs/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "NVIDIA Skills Showcase",
    category: "ai-nvidia",
    type: "Homepage App",
    description: "首頁的 NVIDIA skills 搜尋式案例展示，涵蓋 GPU 計算、LLM 訓練、推論部署、醫療 AI 與 Physical AI。",
    tags: ["React", "Search", "NVIDIA", "Case Library"],
    demo: "/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "nim-rag-language-tutor",
    category: "ai-nvidia",
    type: "GitHub Pages Project",
    description: "以 NVIDIA NIM API 建構 RAG language tutor，結合 grounded grammar answers 與 practice exercises。",
    tags: ["NIM", "RAG", "Language Tutor", "Python"],
    demo: "https://jjfishjj.github.io/nim-rag-language-tutor/",
    repo: "https://github.com/jjfishjj/nim-rag-language-tutor",
  },
  {
    title: "nvidia-computex2026-optimizer",
    category: "ai-nvidia",
    type: "GitHub Repo",
    description: "面向 Vera Rubin、Nemotron 3 Ultra 550B 與 Alpamayo 2 Super 的 NVIDIA Computex 2026 技術最佳化工具構想。",
    tags: ["Optimization", "NVIDIA", "Python", "AI Infra"],
    repo: "https://github.com/jjfishjj/nvidia-computex2026-optimizer",
  },
  {
    title: "nvidia-dev-pipeline-demo",
    category: "ai-nvidia",
    type: "GitHub Pages Project",
    description: "NVIDIA developer pipeline 的網站展示型 demo，用來整理 AI 開發、部署與展示流程。",
    tags: ["Pipeline", "HTML", "NVIDIA", "Developer Demo"],
    demo: "https://jjfishjj.github.io/nvidia-dev-pipeline-demo/",
    repo: "https://github.com/jjfishjj/nvidia-dev-pipeline-demo",
  },
  {
    title: "flowforge-factory-twin",
    category: "digital-twin-3d",
    type: "GitHub Pages Project",
    description: "OpenUSD-ready factory digital twin，用於工廠 layout planning、capacity simulation 與 Omniverse workflow 展示。",
    tags: ["OpenUSD", "Omniverse", "Digital Twin", "Manufacturing"],
    demo: "https://jjfishjj.github.io/flowforge-factory-twin/",
    repo: "https://github.com/jjfishjj/flowforge-factory-twin",
  },
  {
    title: "NCTU Campus Digital Twin",
    category: "digital-twin-3d",
    type: "Interactive Page",
    description: "互動式校園 3D / digital twin 導覽頁，可延伸成校園導覽、展覽互動或空間資料展示。",
    tags: ["3D", "Campus Tour", "Digital Twin", "Web Interaction"],
    demo: "/nctu-campus-digital-twin/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "Resume 3D",
    category: "digital-twin-3d",
    type: "Portfolio Experience",
    description: "多語系 3D 視覺履歷頁，支援中文、英文、西班牙文、法文切換，連接專業經歷、遊戲化作品集與視覺化自我介紹。",
    tags: ["3D Resume", "Multilingual", "Portfolio", "Interactive"],
    demo: "/resume-3d/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "openusd-factory-digital-twin",
    category: "digital-twin-3d",
    type: "GitHub Pages Project",
    description: "以 Python 程式化產生工廠產線 digital twin，可接 Omniverse / OpenUSD 工作流且可 GPU-free 執行。",
    tags: ["Python", "OpenUSD", "Factory", "Simulation"],
    demo: "https://jjfishjj.github.io/openusd-factory-digital-twin/",
    repo: "https://github.com/jjfishjj/openusd-factory-digital-twin",
  },
  {
    title: "ai-prompt-game-tutorial",
    category: "language-learning",
    type: "Teaching Page",
    description: "AI Prompt x Game Design 教學樣板，整理 prompt 架構、遊戲企劃、素材生成、程式原型與課後任務。",
    tags: ["AI Prompt", "Game Design", "Teaching", "Workshop"],
    demo: "/ai-prompt-game-tutorial/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "Memolingua",
    category: "language-learning",
    type: "GitHub Pages App",
    description: "語言學習產品方向，適合承載團塊法、拼寫記憶術、練習系統與個人化學習路徑。",
    tags: ["Language Learning", "Memory", "HTML", "Education"],
    demo: "https://jjfishjj.github.io/memolingua/",
    repo: "https://github.com/jjfishjj/memolingua",
  },
  {
    title: "Fluent AI Practice",
    category: "language-learning",
    type: "Learning Tool",
    description: "網站內的語言練習頁，可作為 AI 輔助練習、發音/語塊訓練與課程 demo 的入口。",
    tags: ["Fluent AI", "Practice", "Learning UX", "Education"],
    demo: "/fluent-ai/practice/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "Fluent AI Learning Gym Plan",
    category: "language-learning",
    type: "Course Plan",
    description: "語言學習 gym 規劃頁，可整理課程節奏、練習任務、能力階段與學習成果。",
    tags: ["Learning Plan", "Course Design", "AI Tutor", "Language"],
    demo: "/fluent-ai/learning-gym-plan/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "Lectures",
    category: "language-learning",
    type: "Website Page",
    description: "講座資訊預備頁，可放團塊法、拼寫記憶術、公開日期、報名與講義內容。",
    tags: ["講座", "團塊法", "拼寫記憶術", "Teaching"],
    demo: "/lectures/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "Resume Footprint Map",
    category: "data-dashboard",
    type: "Career Dashboard",
    description: "把履歷、專案與能力足跡用地圖/路徑方式呈現，讓訪客快速理解經驗流向。",
    tags: ["Resume", "Visualization", "Career Map", "Dashboard"],
    demo: "/resume-footprint-map/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "Professional Profile Dashboard",
    category: "data-dashboard",
    type: "Profile Page",
    description: "LinkedIn 經歷、Gamania AI、MetaSens 遊戲、資料分析、3D Lab 與成果指標的個人儀表板。",
    tags: ["LinkedIn", "Experience", "Dashboard", "3D Lab"],
    demo: "/linkedin/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "Data Analytics Visualization Project",
    category: "data-dashboard",
    type: "Interactive Dashboard",
    description: "以 Gamania / Prasia 類遊戲營運、汽車售價預測、顧客/玩家分群、紅酒品質與指標視覺化為案例，展示 KPI、漏斗、RFM 與決策摘要。",
    tags: ["Gamania", "Prasia", "Prediction", "Segmentation"],
    demo: "/projects/data-analytics-visualization/",
    repo: "https://github.com/jjfishjj/jjfishjj.github.io",
  },
  {
    title: "cudf-game-analytics-benchmark",
    category: "data-dashboard",
    type: "GitHub Pages Project",
    description: "Game-ops analytics benchmark：20M events 的 pandas vs RAPIDS cudf.pandas 對照，涵蓋 RFM、retention、funnel。",
    tags: ["RAPIDS", "Game Analytics", "Benchmark", "Jupyter"],
    demo: "https://jjfishjj.github.io/cudf-game-analytics-benchmark/",
    repo: "https://github.com/jjfishjj/cudf-game-analytics-benchmark",
  },
  {
    title: "nim-inference-cost-analysis",
    category: "data-dashboard",
    type: "GitHub Pages Project",
    description: "PM 視角的 LLM inference TCO framework，對照 managed API 與 NVIDIA NIM self-hosting 成本。",
    tags: ["TCO", "LLM Inference", "Cost Calculator", "Python"],
    demo: "https://jjfishjj.github.io/nim-inference-cost-analysis/",
    repo: "https://github.com/jjfishjj/nim-inference-cost-analysis",
  },
  {
    title: "tomoaid-operating-board",
    category: "data-dashboard",
    type: "GitHub Pages Project",
    description: "TomoAid 四大專案營運看板，展示 Human First > AI First 的專案管理與營運視覺化。",
    tags: ["Operating Board", "KPI", "HTML", "Strategy"],
    demo: "https://jjfishjj.github.io/tomoaid-operating-board/",
    repo: "https://github.com/jjfishjj/tomoaid-operating-board",
  },
  {
    title: "chunshin-learningops-insight",
    category: "data-dashboard",
    type: "GitHub Pages Project",
    description: "春心 LearningOps Insight demo，整理數據、校園 activation、語言顧問與課程營運。",
    tags: ["LearningOps", "Analytics", "JavaScript", "Campus"],
    demo: "https://jjfishjj.github.io/chunshin-learningops-insight/",
    repo: "https://github.com/jjfishjj/chunshin-learningops-insight",
  },
  {
    title: "relayform",
    category: "product-prototype",
    type: "GitHub Pages Project",
    description: "Universal AI Connector prototype for websites and OpenAPI，把網站表單與 AI connector 工作流串起來。",
    tags: ["AI Connector", "OpenAPI", "TypeScript", "Prototype"],
    demo: "https://jjfishjj.github.io/relayform/",
    repo: "https://github.com/jjfishjj/relayform",
  },
  {
    title: "zero-ai-connector-hub",
    category: "product-prototype",
    type: "GitHub Pages Project",
    description: "AI connector hub 原型，適合展示跨網站、跨服務的 AI workflow 串接概念。",
    tags: ["Connector Hub", "TypeScript", "Workflow", "AI Product"],
    demo: "https://jjfishjj.github.io/zero-ai-connector-hub/",
    repo: "https://github.com/jjfishjj/zero-ai-connector-hub",
  },
  {
    title: "software-intake-form",
    category: "product-prototype",
    type: "GitHub Pages Project",
    description: "互動式 software development intake form prototype，用來收斂需求、範圍、時程與合作資訊。",
    tags: ["Form UX", "Requirement Intake", "HTML", "Prototype"],
    demo: "https://jjfishjj.github.io/software-intake-form/",
    repo: "https://github.com/jjfishjj/software-intake-form",
  },
  {
    title: "liho-tv-strategy-demo",
    category: "product-prototype",
    type: "GitHub Pages Project",
    description: "多語策略合作 prototype，將品牌、內容與合作方案整理成可互動提案頁。",
    tags: ["Strategy Demo", "Multilingual", "HTML", "Proposal"],
    demo: "https://jjfishjj.github.io/liho-tv-strategy-demo/",
    repo: "https://github.com/jjfishjj/liho-tv-strategy-demo",
  },
  {
    title: "lifegether-demo",
    category: "product-prototype",
    type: "GitHub Pages Project",
    description: "LifeGether responsive community event platform demo，展示社群活動平台與 mobile-first UI。",
    tags: ["Community", "Events", "JavaScript", "Responsive"],
    demo: "https://jjfishjj.github.io/lifegether-demo/",
    repo: "https://github.com/jjfishjj/lifegether-demo",
  },
  {
    title: "gpt-ai-assistant",
    category: "product-prototype",
    type: "GitHub Repo",
    description: "OpenAI + LINE + Vercel 的 GPT AI Assistant，可作為聊天服務、客服與 LINE bot 作品經驗。",
    tags: ["OpenAI", "LINE", "Vercel", "Assistant"],
    demo: "https://my-ai-assistant.vercel.app",
    repo: "https://github.com/jjfishjj/gpt-ai-assistant",
  },
  {
    title: "nemoclaw-arduino-robot-arm",
    category: "research-hardware",
    type: "GitHub Pages Project",
    description: "Safety-first NemoClaw/OpenClaw control bridge for an Arduino robot arm，連接 agent safety 與機器人控制。",
    tags: ["Robot Arm", "Arduino", "NemoClaw", "Python"],
    demo: "https://jjfishjj.github.io/nemoclaw-arduino-robot-arm/",
    repo: "https://github.com/jjfishjj/nemoclaw-arduino-robot-arm",
  },
  {
    title: "ic-power-efficiency",
    category: "research-hardware",
    type: "GitHub Repo",
    description: "研究 IC 晶片節能技術：Clock Gating、Power Gating、DVFS 與 AI 功耗預測。",
    tags: ["IC", "DVFS", "Power Gating", "Python"],
    repo: "https://github.com/jjfishjj/ic-power-efficiency",
  },
  {
    title: "gpu-power-demo",
    category: "research-hardware",
    type: "GitHub Pages Project",
    description: "GPU power reduction techniques demo，包含 RTL clock gating、INT8/INT4 quantisation、2:4 sparsity 與 DVFS。",
    tags: ["GPU Power", "Verilog", "Python", "Optimization"],
    demo: "https://jjfishjj.github.io/gpu-power-demo/",
    repo: "https://github.com/jjfishjj/gpu-power-demo",
  },
  {
    title: "jetson-edge-ai-proposal",
    category: "research-hardware",
    type: "GitHub Pages Project",
    description: "StoreSense：privacy-first retail footfall analytics on NVIDIA Jetson，包含產品提案、架構與 phased prototype plan。",
    tags: ["Jetson", "Edge AI", "Retail Analytics", "Proposal"],
    demo: "https://jjfishjj.github.io/jetson-edge-ai-proposal/",
    repo: "https://github.com/jjfishjj/jetson-edge-ai-proposal",
  },
  {
    title: "omniverse-ops-starter",
    category: "research-hardware",
    type: "GitHub Pages Project",
    description: "Omniverse operations starter，適合延伸成 digital twin ops、simulation ops 與工具鏈管理展示。",
    tags: ["Omniverse", "Ops", "Python", "Simulation"],
    demo: "https://jjfishjj.github.io/omniverse-ops-starter/",
    repo: "https://github.com/jjfishjj/omniverse-ops-starter",
  },
]

const app = document.querySelector("#projectApp")
const categoryFromPage = document.body.dataset.category || "all"
let currentCategory = categories.some((category) => category.id === categoryFromPage) ? categoryFromPage : "all"
let query = ""

function getCategory(id) {
  return categories.find((category) => category.id === id) || categories[0]
}

function categoryHref(id) {
  return id === "all" ? "/projects/" : `/projects/${id}/`
}

function getVisibleProjects() {
  const normalized = query.trim().toLowerCase()
  return projects.filter((project) => {
    const categoryMatch = currentCategory === "all" || project.category === currentCategory
    const text = [project.title, project.type, project.description, project.tags.join(" ")].join(" ").toLowerCase()
    return categoryMatch && (!normalized || text.includes(normalized))
  })
}

function renderCategoryNav() {
  return categories
    .map((category) => {
      const count = category.id === "all" ? projects.length : projects.filter((project) => project.category === category.id).length
      const active = category.id === currentCategory ? " active" : ""
      return `
        <a class="category-link${active}" href="${categoryHref(category.id)}">
          <strong>${category.short}</strong>
          <span>${count} 個專案 · ${category.intro}</span>
        </a>
      `
    })
    .join("")
}

function renderProject(project) {
  const category = getCategory(project.category)
  const demoLink = project.demo ? `<a class="project-link" href="${project.demo}" target="_blank" rel="noreferrer">查看展示</a>` : ""
  const repoLink = project.repo ? `<a class="project-link" href="${project.repo}" target="_blank" rel="noreferrer">GitHub</a>` : ""
  return `
    <article class="project-card">
      <div>
        <div class="project-type">${project.type}</div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tag-row">
          <span class="tag">${category.short}</span>
          ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
      <div class="project-actions">${demoLink}${repoLink}</div>
    </article>
  `
}

function render() {
  const selected = getCategory(currentCategory)
  const visible = getVisibleProjects()
  app.innerHTML = `
    <section class="hero">
      <div class="shell hero-grid">
        <div>
          <div class="eyebrow">Project Portfolio</div>
          <h1>${selected.id === "all" ? "把不同種類的專案整理成可瀏覽的作品集。" : selected.title}</h1>
          <p class="lead">${selected.intro}</p>
          <div class="actions">
            <a class="button primary" href="#project-list">看專案列表</a>
            <a class="button secondary" href="/linkedin/">看經歷儀表板</a>
          </div>
        </div>
        <aside class="summary-panel">
          <h2>目前整理狀態</h2>
          <p>依照技術方向與展示目的分頁，讓訪客可以先選主題，再進入 demo、GitHub repo 或履歷頁理解成果。</p>
          <div class="summary-stats">
            <div class="summary-stat"><strong>${projects.length}</strong><span>整理專案</span></div>
            <div class="summary-stat"><strong>${categories.length - 1}</strong><span>專案分類</span></div>
            <div class="summary-stat"><strong>${projects.filter((project) => project.demo).length}</strong><span>可看展示</span></div>
          </div>
        </aside>
      </div>
    </section>

    <main class="shell">
      <nav class="category-nav" aria-label="專案分類">
        ${renderCategoryNav()}
      </nav>

      <section id="project-list">
        <div class="section-head">
          <div>
            <div class="eyebrow">${selected.short}</div>
            <h2>${selected.title}</h2>
          </div>
          <p>${selected.id === "all" ? "這裡先把作品集用主題分類，之後新增 repo 或 demo 時，只要加入對應分類就能維持清楚。" : selected.intro}</p>
        </div>

        <div class="toolbar">
          <input class="search" type="search" placeholder="搜尋專案、技術或用途" value="${query}" aria-label="搜尋專案" />
          <span class="count">${visible.length} / ${projects.length} 個專案</span>
        </div>

        ${
          visible.length
            ? `<div class="project-grid">${visible.map(renderProject).join("")}</div>`
            : `<div class="empty">目前沒有符合「${query}」的專案，請換一個關鍵字。</div>`
        }
      </section>
    </main>
  `

  app.querySelector(".search")?.addEventListener("input", (event) => {
    query = event.target.value
    render()
    app.querySelector(".search")?.focus()
  })
}

render()
