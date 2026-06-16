import { useState } from 'react'
import './App.css'

const SKILLS = [
  {
    cat: 'compute', icon: '⚡', title: 'cuDF', skill: 'accelerated-computing-cudf',
    desc: 'GPU DataFrame — pandas 加速、ETL、multi-GPU',
    scenario: '8000 萬筆訂單 pandas ETL 需 40 分鐘，改用 cuDF 後 A100 上只需 90 秒。',
    cmd: 'npx skills add nvidia/skills --skill accelerated-computing-cudf --agent claude-code',
  },
  {
    cat: 'compute', icon: '⚛️', title: 'CUDA-Q', skill: 'cudaq-guide',
    desc: '量子計算框架 — GPU 模擬、QPU 硬體',
    scenario: '藥廠在 NVIDIA GPU 上模擬分子對接量子電路，從 CPU 版遷移到 QPU 硬體。',
    cmd: 'npx skills add nvidia/skills --skill cudaq-guide --agent claude-code',
  },
  {
    cat: 'compute', icon: '🗺️', title: 'cuOpt 車輛路由', skill: 'cuopt-routing-api-python',
    desc: 'GPU 最佳化 — VRP 車輛路徑規劃',
    scenario: '500 輛貨車、3000 個有時間窗的客戶，5 分鐘內算出最佳配送路線。',
    cmd: 'npx skills add nvidia/skills --skill cuopt-routing-api-python --agent claude-code',
  },
  {
    cat: 'compute', icon: '📐', title: 'cuOpt 線性規劃', skill: 'cuopt-numerical-optimization-api-python',
    desc: 'GPU LP/QP 求解 — 工廠排程最佳化',
    scenario: '含 10 萬個變數的工廠排程線性規劃，傳統 CPU solver 需幾小時，GPU 秒解。',
    cmd: 'npx skills add nvidia/skills --skill cuopt-numerical-optimization-api-python --agent claude-code',
  },
  {
    cat: 'compute', icon: '🔢', title: 'cuPyNumeric', skill: 'cupynumeric-migration-readiness',
    desc: 'NumPy → 多 GPU 節點平行運算',
    scenario: '氣候模擬 NumPy 腳本評估遷移到 32 個 GPU 節點的 cuPyNumeric 可行性。',
    cmd: 'npx skills add nvidia/skills --skill cupynumeric-migration-readiness --agent claude-code',
  },
  {
    cat: 'compute', icon: '🧩', title: 'TileGym', skill: 'tilegym-adding-cutile-kernel',
    desc: 'GPU tile kernel 開發與效能最佳化',
    scenario: '為自訂 sliding window attention 加入 CuTile kernel，在 H100 上分析效能瓶頸。',
    cmd: 'npx skills add nvidia/skills --skill tilegym-adding-cutile-kernel --agent claude-code',
  },
  {
    cat: 'ai', icon: '🧠', title: 'NeMo AutoModel', skill: 'nemo-automodel-distributed-training',
    desc: 'PyTorch LLM/VLM 分散式訓練',
    scenario: '用 8 張 H100 fine-tune Llama-3 70B，自動設定 FSDP2 + gradient checkpointing。',
    cmd: 'npx skills add nvidia/skills --skill nemo-automodel-distributed-training --agent claude-code',
  },
  {
    cat: 'ai', icon: '🤖', title: 'NeMo-RL', skill: 'launch-nemo-rl',
    desc: 'RLHF 訓練 — GRPO、DPO、SFT on Ray',
    scenario: '對 Mixtral 8x7B 做 GRPO 強化學習微調，在 Ray cluster 上跑多節點 RLHF。',
    cmd: 'npx skills add nvidia/skills --skill launch-nemo-rl --agent claude-code',
  },
  {
    cat: 'ai', icon: '📊', title: 'Megatron-Core', skill: 'mcore-run-on-slurm',
    desc: '大規模分散式訓練 — Slurm 叢集',
    scenario: '國家超算中心在 Slurm 上跑 1750 億參數模型，設定 tensor/pipeline/data 三路平行。',
    cmd: 'npx skills add nvidia/skills --skill mcore-run-on-slurm --agent claude-code',
  },
  {
    cat: 'ai', icon: '🔄', title: 'NeMo MBridge', skill: 'nemo-mbridge-recipe-recommender',
    desc: 'HuggingFace ↔ Megatron-Core 轉換',
    scenario: 'HuggingFace Llama checkpoint 轉換為 Megatron 格式並推薦最佳訓練 recipe。',
    cmd: 'npx skills add nvidia/skills --skill nemo-mbridge-recipe-recommender --agent claude-code',
  },
  {
    cat: 'ai', icon: '🌊', title: 'DALI', skill: 'dali-dynamic-mode',
    desc: 'GPU 加速資料載入 — 解決訓練瓶頸',
    scenario: '訓練影像分類模型時資料前處理是瓶頸，GPU 利用率從 60% 提升到 95%。',
    cmd: 'npx skills add nvidia/skills --skill dali-dynamic-mode --agent claude-code',
  },
  {
    cat: 'ai', icon: '🌤️', title: 'Earth2Studio', skill: 'earth2studio-deterministic-forecast',
    desc: 'AI 天氣預報 — FourCastNet 全球預測',
    scenario: '氣象局用 FourCastNet 做 7 天全球確定性天氣預報，從 ERA5 到視覺化預報圖。',
    cmd: 'npx skills add nvidia/skills --skill earth2studio-deterministic-forecast --agent claude-code',
  },
  {
    cat: 'deploy', icon: '🖥️', title: 'Dynamo', skill: 'dynamo-troubleshoot',
    desc: 'LLM 分解式推論 — K8s 部署診斷',
    scenario: 'K8s 上 NIXL interconnect 超時，診斷 prefill/decode 分離架構的網路問題。',
    cmd: 'npx skills add nvidia/skills --skill dynamo-troubleshoot --agent claude-code',
  },
  {
    cat: 'deploy', icon: '📦', title: 'RAG Blueprint', skill: 'rag-blueprint',
    desc: 'RAG pipeline — Docker Compose 快速部署',
    scenario: 'Docker Compose 部署 RAG 系統，索引 10 萬份 PDF 法律文件並提供問答服務。',
    cmd: 'npx skills add nvidia/skills --skill rag-blueprint --agent claude-code',
  },
  {
    cat: 'deploy', icon: '🔬', title: 'AIQ', skill: 'aiq-research',
    desc: 'AI-Q Blueprint — 本地深度研究工作流程',
    scenario: '研究機構在本地部署 AI-Q，讓 agent 自動多步驟蒐集文獻並生成摘要報告。',
    cmd: 'npx skills add nvidia/skills --skill aiq-research --agent claude-code',
  },
  {
    cat: 'deploy', icon: '🎙️', title: 'Nemotron Speech', skill: 'nemotron-speech',
    desc: 'ASR/TTS NIM — 自架語音辨識服務',
    scenario: '客服中心在自有 GPU 上部署 Riva NIM，做即時語音辨識，不依賴雲端 API。',
    cmd: 'npx skills add nvidia/skills --skill nemotron-speech --agent claude-code',
  },
  {
    cat: 'deploy', icon: '🏥', title: 'Holoscan SDK', skill: 'holoscan-setup',
    desc: '醫療/邊緣 AI 串流 — Clara AGX',
    scenario: '手術室在 Clara AGX 上建立即時超音波影像 AI 推論 pipeline，整合感測器。',
    cmd: 'npx skills add nvidia/skills --skill holoscan-setup --agent claude-code',
  },
  {
    cat: 'deploy', icon: '🛡️', title: 'NemoClaw', skill: 'nemoclaw-user-deploy-remote',
    desc: '安全 agent 沙箱 — 細粒度執行政策',
    scenario: '金融機構在隔離沙箱部署 AI agent，確保無法存取生產資料庫並設定執行政策。',
    cmd: 'npx skills add nvidia/skills --skill nemoclaw-user-deploy-remote --agent claude-code',
  },
  {
    cat: 'deploy', icon: '📚', title: 'NeMo Retriever', skill: 'nemo-retriever',
    desc: '本地語意搜尋 — 大規模文件索引',
    scenario: '法律科技公司在本地部署 NeMo Retriever，索引 50 萬份合約做語意搜尋問答。',
    cmd: 'npx skills add nvidia/skills --skill nemo-retriever --agent claude-code',
  },
  {
    cat: 'medical', icon: '🩻', title: 'DICOM 處理', skill: 'dicom-series-to-volume',
    desc: 'CT/MR DICOM → 3D Volume 轉換',
    scenario: '醫院 PACS 每天接收 500 個 CT 序列，自動轉換為 3D volume 並萃取 metadata。',
    cmd: 'npx skills add nvidia/skills --skill dicom-series-to-volume --agent claude-code',
  },
  {
    cat: 'medical', icon: '🫀', title: 'CT 器官分割', skill: 'nv-segment-ct',
    desc: '腹部 CT 自動器官分割',
    scenario: '放射科自動分割肝臟、脾臟和腎臟，提供手術前規劃的 3D mask 模型。',
    cmd: 'npx skills add nvidia/skills --skill nv-segment-ct --agent claude-code',
  },
  {
    cat: 'medical', icon: '🎤', title: 'Clinical ASR', skill: 'digital-health-clinical-asr-eval',
    desc: '醫療語音辨識 KER 評估',
    scenario: '醫療 AI 公司評估 ASR 模型在心臟科術語的關鍵詞錯誤率，建立 benchmark。',
    cmd: 'npx skills add nvidia/skills --skill digital-health-clinical-asr-eval --agent claude-code',
  },
  {
    cat: 'vision', icon: '🎥', title: 'VSS 影片摘要', skill: 'vss-summarize-video',
    desc: '監控影片自動事件摘要',
    scenario: '保全公司自動分析 24 小時監控影片，每小時生成包含異常事件的結構化報告。',
    cmd: 'npx skills add nvidia/skills --skill vss-summarize-video --agent claude-code',
  },
  {
    cat: 'vision', icon: '👁️', title: 'VSS 行為分析', skill: 'vss-setup-behavior-analytics',
    desc: '零售賣場人群行為偵測',
    scenario: '零售商在賣場偵測顧客停留熱點和異常擁擠行為，即時觸發警報通知。',
    cmd: 'npx skills add nvidia/skills --skill vss-setup-behavior-analytics --agent claude-code',
  },
  {
    cat: 'vision', icon: '🏭', title: 'DeepStream', skill: 'deepstream-dev',
    desc: 'Jetson 邊緣 AI 視覺串流 pipeline',
    scenario: '工廠產線在 Jetson Orin 上做即時瑕疵偵測，整合自訂 YOLO 模型。',
    cmd: 'npx skills add nvidia/skills --skill deepstream-dev --agent claude-code',
  },
  {
    cat: 'vision', icon: '🤖', title: 'Physical AI', skill: 'physical-ai-neural-reconstruction',
    desc: '神經場景重建 — 機器人 RL 模擬',
    scenario: '機器人公司從多角度照片重建工廠 NeRF 3D 場景，用於強化學習環境模擬。',
    cmd: 'npx skills add nvidia/skills --skill physical-ai-neural-reconstruction --agent claude-code',
  },
]

const CATS = [
  { id: 'all', label: '全部' },
  { id: 'compute', label: 'GPU 計算' },
  { id: 'ai', label: 'AI / LLM' },
  { id: 'deploy', label: '部署 / 推論' },
  { id: 'medical', label: '醫療 AI' },
  { id: 'vision', label: '視覺 AI' },
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
  const [expanded, setExpanded] = useState(null)
  const filtered = filter === 'all' ? SKILLS : SKILLS.filter(s => s.cat === filter)

  return (
    <div className="page">
      <header className="hero">
        <div className="nv-badge">NVIDIA Agent Skills</div>
        <h1>實際應用案例展示</h1>
        <p className="hero-sub">
          26 個產品類別、120+ 個可攜式 skill，教 AI agent 如何使用 NVIDIA 軟體
        </p>
        <a className="hero-link" href="https://github.com/nvidia/skills" target="_blank" rel="noreferrer">
          github.com/nvidia/skills ↗
        </a>
      </header>

      <main className="main">
        <div className="filter-bar">
          {CATS.map(c => (
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

        <div className="grid">
          {filtered.map(s => (
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
                <div className="card-body" onClick={e => e.stopPropagation()}>
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
