// NVIDIA Agent Skills 案例資料 — 來源 https://github.com/nvidia/skills
const mk = (skill) =>
  `npx skills add nvidia/skills --skill ${skill} --agent claude-code`

const EXTENDED_SKILLS = [
  {
    cat: 'agent', icon: '🧩', title: 'Agentic RAG 編排', skill: 'agentic-rag-orchestration',
    desc: '多步驟 agent — 檢索、工具呼叫與來源引用協作',
    scenario: '讓研究型 agent 先規劃問題，再呼叫檢索與計算工具，最後輸出帶來源的可追溯答案。',
    cmd: 'npx skills add nvidia/skills --skill agentic-rag-orchestration --agent claude-code',
    tags: ['Agent', 'RAG', 'Tool Use'], level: '進階',
    focus: '把單輪問答拆成可觀測、可重試的工具鏈。',
    outcomes: ['可追蹤每一步工具呼叫', '降低無來源回答', '支援失敗重試與人工接管'],
    prerequisites: '熟悉 RAG、function calling 與基本服務編排。',
  },
  {
    cat: 'agent', icon: '🛡️', title: 'Agent Guardrails', skill: 'agent-guardrails',
    desc: 'AI agent 安全邊界 — policy、權限與敏感資料防護',
    scenario: '為企業 agent 設定可允許的工具、資料範圍與敏感資訊遮罩，讓自動化流程可被治理。',
    cmd: 'npx skills add nvidia/skills --skill agent-guardrails --agent claude-code',
    tags: ['Safety', 'Policy', 'Governance'], level: '進階',
    focus: '以最小權限原則設計 agent 的執行邊界。',
    outcomes: ['工具權限白名單', '敏感內容過濾', '政策違規事件記錄'],
    prerequisites: '了解 API 權限、審計紀錄與基本威脅模型。',
  },
  {
    cat: 'agent', icon: '📡', title: 'Agent Observability', skill: 'agent-observability',
    desc: 'Agent 可觀測性 — latency、token、工具成功率與成本',
    scenario: '將 agent 每一步的延遲、token 消耗、工具失敗率與使用者回饋整理成可行動的營運指標。',
    cmd: 'npx skills add nvidia/skills --skill agent-observability --agent claude-code',
    tags: ['Observability', 'Latency', 'Cost'], level: '中階',
    focus: '從 trace 與 metrics 找出 agent 體驗與成本瓶頸。',
    outcomes: ['建立請求級 trace', '比較模型與 prompt 成本', '定位工具失敗熱點'],
    prerequisites: '具備基本 logging、metrics 與服務監控概念。',
  },
  {
    cat: 'agent', icon: '🧪', title: 'Agent Evaluation', skill: 'agent-evaluation',
    desc: 'Agent 評估 — 任務成功率、引用正確性與安全測試',
    scenario: '建立可重複的測試集，評估 agent 是否完成任務、正確引用資料並遵守安全政策。',
    cmd: 'npx skills add nvidia/skills --skill agent-evaluation --agent claude-code',
    tags: ['Evaluation', 'Quality', 'Red Team'], level: '進階',
    focus: '把主觀 demo 轉成可回歸的品質門檻。',
    outcomes: ['任務成功率基準', '引用與答案品質分數', '安全回歸測試報告'],
    prerequisites: '了解測試資料集、評分規則與模型輸出評估。',
  },
  {
    cat: 'data', icon: '🚀', title: 'Triton 推論服務', skill: 'triton-inference-serving',
    desc: '模型服務化 — batching、ensemble 與 GPU 資源配置',
    scenario: '把訓練完成的視覺模型包成 Triton inference server，依流量調整 dynamic batching 與模型併行。',
    cmd: 'docker run --gpus all --rm -p 8000:8000 nvcr.io/nvidia/tritonserver:latest',
    tags: ['Triton', 'Serving', 'Batching'], level: '進階',
    focus: '在延遲、吞吐量與 GPU 使用率間找到服務平衡。',
    outcomes: ['可觀測的 inference endpoint', '可調整 batch 策略', '支援多模型 ensemble'],
    prerequisites: '熟悉 Docker、REST/gRPC API 與模型輸入輸出格式。',
  },
  {
    cat: 'data', icon: '⚡', title: 'TensorRT-LLM 效能調校', skill: 'tensorrt-llm-performance',
    desc: 'LLM 推論最佳化 — quantization、KV cache 與吞吐量',
    scenario: '針對長上下文生成服務比較 FP16、INT8 與 KV cache 設定，找出符合 SLA 的部署配置。',
    cmd: 'nvidia-smi && trtllm-build --help',
    tags: ['TensorRT-LLM', 'Quantization', 'SLA'], level: '進階',
    focus: '用 benchmark 數據驗證推論最佳化，而非只看單次速度。',
    outcomes: ['首 token 延遲比較', '每秒 token 吞吐量', '顯存與成本估算'],
    prerequisites: '熟悉 LLM serving、GPU memory 與基本 benchmark 設計。',
  },
  {
    cat: 'data', icon: '🔬', title: 'GPU Profiling', skill: 'gpu-profiling-workflow',
    desc: 'Nsight 效能分析 — kernel、memory 與 CPU/GPU overlap',
    scenario: '針對 GPU 利用率偏低的訓練工作，從 timeline 與 kernel 統計找出資料載入或同步瓶頸。',
    cmd: 'nsys profile --stats=true python train.py',
    tags: ['Nsight', 'Profiling', 'Performance'], level: '中階',
    focus: '以 profiler evidence 取代猜測，建立優化前後的可比基準。',
    outcomes: ['定位 idle gap', '比較 kernel 時間', '確認 memory bandwidth 瓶頸'],
    prerequisites: '具備 Python 訓練流程與 GPU memory 基礎。',
  },
  {
    cat: 'data', icon: '📈', title: 'RAPIDS 遊戲營運分析', skill: 'rapids-game-analytics',
    desc: 'GPU DataFrame — retention、RFM 與 funnel 分析',
    scenario: '將大型遊戲事件資料從 pandas 遷移到 RAPIDS，快速完成留存、分群與付費漏斗分析。',
    cmd: 'python -c "import cudf; print(cudf.__version__)"',
    tags: ['RAPIDS', 'Game Analytics', 'Funnel'], level: '中階',
    focus: '讓營運分析能在更短時間內迭代更多問題。',
    outcomes: ['縮短資料清理時間', '支援多版本分群比較', '輸出可讀 KPI 摘要'],
    prerequisites: '熟悉 pandas、SQL 與遊戲事件資料模型。',
  },
]

const BASE_SKILLS = [
  // ── GPU 計算 ──────────────────────────────
  {
    cat: 'compute', icon: '⚡', title: 'cuDF', skill: 'accelerated-computing-cudf',
    desc: 'GPU DataFrame — pandas 加速、ETL、multi-GPU',
    scenario: '8000 萬筆訂單 pandas ETL 需 40 分鐘，改用 cuDF 後 A100 上只需 90 秒。',
  },
  {
    cat: 'compute', icon: '⚛️', title: 'CUDA-Q', skill: 'cudaq-guide',
    desc: '量子計算框架 — GPU 模擬、QPU 硬體',
    scenario: '藥廠在 NVIDIA GPU 上模擬分子對接量子電路，從 CPU 版遷移到 QPU 硬體。',
  },
  {
    cat: 'compute', icon: '🗺️', title: 'cuOpt 車輛路由', skill: 'cuopt-routing-api-python',
    desc: 'GPU 最佳化 — VRP 車輛路徑規劃',
    scenario: '500 輛貨車、3000 個有時間窗的客戶，5 分鐘內算出最佳配送路線。',
  },
  {
    cat: 'compute', icon: '📐', title: 'cuOpt 線性規劃', skill: 'cuopt-numerical-optimization-api-python',
    desc: 'GPU LP/QP 求解 — 工廠排程最佳化',
    scenario: '含 10 萬個變數的工廠排程線性規劃，傳統 CPU solver 需幾小時，GPU 秒解。',
  },
  {
    cat: 'compute', icon: '🚚', title: 'cuOpt 問題建模', skill: 'cuopt-routing-formulation',
    desc: '把現實物流需求轉成 VRP 數學模型',
    scenario: '把「冷鏈車不能載冷凍與常溫」這類業務限制，正確轉成 cuOpt 約束式。',
  },
  {
    cat: 'compute', icon: '🔢', title: 'cuPyNumeric', skill: 'cupynumeric-migration-readiness',
    desc: 'NumPy → 多 GPU 節點平行運算',
    scenario: '氣候模擬 NumPy 腳本評估遷移到 32 個 GPU 節點的 cuPyNumeric 可行性。',
  },
  {
    cat: 'compute', icon: '💾', title: 'cuPyNumeric 平行 I/O', skill: 'cupynumeric-parallel-data-load',
    desc: 'HDF5 多節點平行資料載入',
    scenario: '數 TB 的 HDF5 科學資料集，跨多節點平行讀取避免單點 I/O 瓶頸。',
  },
  {
    cat: 'compute', icon: '🧩', title: 'TileGym', skill: 'tilegym-adding-cutile-kernel',
    desc: 'GPU tile kernel 開發與效能最佳化',
    scenario: '為自訂 sliding window attention 加入 CuTile kernel，在 H100 上分析效能瓶頸。',
  },

  // ── AI / LLM 訓練 ─────────────────────────
  {
    cat: 'ai', icon: '🧠', title: 'NeMo AutoModel', skill: 'nemo-automodel-distributed-training',
    desc: 'PyTorch LLM/VLM 分散式訓練',
    scenario: '用 8 張 H100 fine-tune Llama-3 70B，自動設定 FSDP2 + gradient checkpointing。',
  },
  {
    cat: 'ai', icon: '🪄', title: 'AutoModel 模型上線', skill: 'nemo-automodel-model-onboarding',
    desc: '把任意 HuggingFace 模型接入訓練流程',
    scenario: '新的 HF 架構模型還沒官方支援，手把手接入 NeMo AutoModel 做訓練。',
  },
  {
    cat: 'ai', icon: '🤖', title: 'NeMo-RL', skill: 'launch-nemo-rl',
    desc: 'RLHF 訓練 — GRPO、DPO、SFT on Ray',
    scenario: '對 Mixtral 8x7B 做 GRPO 強化學習微調，在 Ray cluster 上跑多節點 RLHF。',
  },
  {
    cat: 'ai', icon: '📊', title: 'Megatron-Core', skill: 'mcore-run-on-slurm',
    desc: '大規模分散式訓練 — Slurm 叢集',
    scenario: '國家超算中心在 Slurm 上跑 1750 億參數模型，設定 tensor/pipeline/data 三路平行。',
  },
  {
    cat: 'ai', icon: '🔄', title: 'NeMo MBridge', skill: 'nemo-mbridge-recipe-recommender',
    desc: 'HuggingFace ↔ Megatron-Core 轉換',
    scenario: 'HuggingFace Llama checkpoint 轉換為 Megatron 格式並推薦最佳訓練 recipe。',
  },
  {
    cat: 'ai', icon: '🧬', title: 'MBridge MoE 最佳化', skill: 'nemo-mbridge-perf-moe-optimization-workflow',
    desc: 'Mixture-of-Experts 訓練效能調校',
    scenario: '訓練 MoE 模型時 expert 通訊變瓶頸，套用 comm-overlap 與 dispatcher 選擇。',
  },
  {
    cat: 'ai', icon: '🌊', title: 'DALI', skill: 'dali-dynamic-mode',
    desc: 'GPU 加速資料載入 — 解決訓練瓶頸',
    scenario: '訓練影像分類模型時資料前處理是瓶頸，GPU 利用率從 60% 提升到 95%。',
  },
  {
    cat: 'ai', icon: '🧪', title: 'Data Designer', skill: 'data-designer',
    desc: '宣告式合成資料集生成 pipeline',
    scenario: '缺少標註資料時，用 NeMo Data Designer 宣告式生成多樣化的合成訓練集。',
  },
  {
    cat: 'ai', icon: '🎯', title: 'Nemotron 客製化', skill: 'nemotron-customize',
    desc: '端到端模型開發與客製化 pipeline',
    scenario: '用 NVIDIA AI 技術棧打造 Nemotron 的客製化、評估、部署完整流程。',
  },
  {
    cat: 'ai', icon: '📈', title: 'NeMo Evaluator', skill: 'nemo-evaluator-plugin',
    desc: '統一 CLI 的模型評估流程',
    scenario: '用 NeMo Platform 的 evaluator 對微調後模型跑標準 benchmark 比較表現。',
  },
  {
    cat: 'ai', icon: '🌤️', title: 'Earth2Studio', skill: 'earth2studio-deterministic-forecast',
    desc: 'AI 天氣預報 — FourCastNet 全球預測',
    scenario: '氣象局用 FourCastNet 做 7 天全球確定性天氣預報，從 ERA5 到視覺化預報圖。',
  },
  {
    cat: 'ai', icon: '🔭', title: 'PhysicsNeMo', skill: 'physicsnemo-discover',
    desc: 'Physics-ML 深度學習框架探索',
    scenario: '工程師想用 PhysicsNeMo 建立流體力學的物理資訊神經網路（PINN）模型。',
  },

  // ── 部署 / 推論 ────────────────────────────
  {
    cat: 'deploy', icon: '🖥️', title: 'Dynamo', skill: 'dynamo-troubleshoot',
    desc: 'LLM 分解式推論 — K8s 部署診斷',
    scenario: 'K8s 上 NIXL interconnect 超時，診斷 prefill/decode 分離架構的網路問題。',
  },
  {
    cat: 'deploy', icon: '🧭', title: 'Dynamo Recipe', skill: 'dynamo-recipe-runner',
    desc: 'K8s 上挑選並部署推論 recipe',
    scenario: '為特定模型與 GPU 數量挑選最適合的 Dynamo 部署 recipe 一鍵啟動。',
  },
  {
    cat: 'deploy', icon: '📦', title: 'RAG Blueprint', skill: 'rag-blueprint',
    desc: 'RAG pipeline — Docker Compose 快速部署',
    scenario: 'Docker Compose 部署 RAG 系統，索引 10 萬份 PDF 法律文件並提供問答服務。',
  },
  {
    cat: 'deploy', icon: '⚙️', title: 'RAG 效能調校', skill: 'rag-perf',
    desc: 'RAG 延遲與吞吐量最佳化',
    scenario: 'RAG 問答回應太慢，調整 chunking、embedding batch 與 reranker 提升吞吐。',
  },
  {
    cat: 'deploy', icon: '🔬', title: 'AIQ', skill: 'aiq-research',
    desc: 'AI-Q Blueprint — 本地深度研究工作流程',
    scenario: '研究機構在本地部署 AI-Q，讓 agent 自動多步驟蒐集文獻並生成摘要報告。',
  },
  {
    cat: 'deploy', icon: '🎙️', title: 'Nemotron Speech', skill: 'nemotron-speech',
    desc: 'ASR/TTS NIM — 自架語音辨識服務',
    scenario: '客服中心在自有 GPU 上部署 Riva NIM，做即時語音辨識，不依賴雲端 API。',
  },
  {
    cat: 'deploy', icon: '🏥', title: 'Holoscan SDK', skill: 'holoscan-setup',
    desc: '醫療/邊緣 AI 串流 — Clara AGX',
    scenario: '手術室在 Clara AGX 上建立即時超音波影像 AI 推論 pipeline，整合感測器。',
  },
  {
    cat: 'deploy', icon: '🔌', title: 'Holoscan Sensor Bridge', skill: 'hsb-setup',
    desc: '感測器橋接 devkit 環境建置',
    scenario: '把 VB1940 攝影機透過 Holoscan Sensor Bridge 接上 GPU，flash FPGA 跑示範。',
  },
  {
    cat: 'deploy', icon: '🛡️', title: 'NemoClaw', skill: 'nemoclaw-user-deploy-remote',
    desc: '安全 agent 沙箱 — 細粒度執行政策',
    scenario: '金融機構在隔離沙箱部署 AI agent，確保無法存取生產資料庫並設定執行政策。',
  },
  {
    cat: 'deploy', icon: '📚', title: 'NeMo Retriever', skill: 'nemo-retriever',
    desc: '本地語意搜尋 — 大規模文件索引',
    scenario: '法律科技公司在本地部署 NeMo Retriever，索引 50 萬份合約做語意搜尋問答。',
  },

  // ── 醫療 AI ───────────────────────────────
  {
    cat: 'medical', icon: '🩻', title: 'DICOM 處理', skill: 'dicom-series-to-volume',
    desc: 'CT/MR DICOM → 3D Volume 轉換',
    scenario: '醫院 PACS 每天接收 500 個 CT 序列，自動轉換為 3D volume 並萃取 metadata。',
  },
  {
    cat: 'medical', icon: '🔍', title: 'DICOM 前處理檢查', skill: 'dicom-series-preflight',
    desc: '序列完整性與品質預檢',
    scenario: '在送入 AI 模型前，自動檢查 DICOM 序列是否缺片、方向錯誤或解析度不符。',
  },
  {
    cat: 'medical', icon: '🫀', title: 'CT 器官分割', skill: 'nv-segment-ct',
    desc: '腹部 CT 自動器官分割',
    scenario: '放射科自動分割肝臟、脾臟和腎臟，提供手術前規劃的 3D mask 模型。',
  },
  {
    cat: 'medical', icon: '🧠', title: 'MR 腦影像生成', skill: 'nv-generate-mr-brain',
    desc: '合成腦部 MR 影像',
    scenario: '研究罕見腦疾病缺乏資料，用生成模型合成腦部 MR 影像擴充訓練集。',
  },
  {
    cat: 'medical', icon: '🫁', title: '胸腔 X 光推理', skill: 'nv-reason-cxr',
    desc: '胸部 X 光 AI 報告推理',
    scenario: '對胸部 X 光自動產生具證據的影像所見描述，輔助放射科醫師判讀。',
  },
  {
    cat: 'medical', icon: '🎤', title: 'Clinical ASR', skill: 'digital-health-clinical-asr-eval',
    desc: '醫療語音辨識 KER 評估',
    scenario: '醫療 AI 公司評估 ASR 模型在心臟科術語的關鍵詞錯誤率，建立 benchmark。',
  },
  {
    cat: 'medical', icon: '🔧', title: 'Clinical ASR 微調', skill: 'digital-health-clinical-asr-finetune',
    desc: '臨床語音模型 fine-tune 指引',
    scenario: '針對特定科別的口音與專有名詞，fine-tune ASR 模型降低關鍵詞錯誤率。',
  },

  // ── 視覺 AI ───────────────────────────────
  {
    cat: 'vision', icon: '🎥', title: 'VSS 影片摘要', skill: 'vss-summarize-video',
    desc: '監控影片自動事件摘要',
    scenario: '保全公司自動分析 24 小時監控影片，每小時生成包含異常事件的結構化報告。',
  },
  {
    cat: 'vision', icon: '❓', title: 'VSS 影片問答', skill: 'vss-ask-video',
    desc: '對影片內容自然語言問答',
    scenario: '問「下午三點有沒有人闖入禁區？」直接從影片庫得到帶時間戳的答案。',
  },
  {
    cat: 'vision', icon: '👁️', title: 'VSS 行為分析', skill: 'vss-setup-behavior-analytics',
    desc: '零售賣場人群行為偵測',
    scenario: '零售商在賣場偵測顧客停留熱點和異常擁擠行為，即時觸發警報通知。',
  },
  {
    cat: 'vision', icon: '🎯', title: 'VSS 2D 偵測追蹤', skill: 'vss-deploy-detection-tracking-2d',
    desc: '物件偵測與多目標追蹤部署',
    scenario: '在路口攝影機部署 2D 偵測追蹤，統計車流量與行人軌跡。',
  },
  {
    cat: 'vision', icon: '🏭', title: 'DeepStream', skill: 'deepstream-dev',
    desc: 'Jetson 邊緣 AI 視覺串流 pipeline',
    scenario: '工廠產線在 Jetson Orin 上做即時瑕疵偵測，整合自訂 YOLO 模型。',
  },
  {
    cat: 'vision', icon: '📥', title: 'DeepStream 模型匯入', skill: 'deepstream-import-vision-model',
    desc: '把視覺模型轉入 DeepStream',
    scenario: '把訓練好的 PyTorch 偵測模型轉成 TensorRT 引擎並接入 DeepStream pipeline。',
  },

  // ── TAO Toolkit ───────────────────────────
  {
    cat: 'tao', icon: '🏷️', title: 'TAO 影像分類', skill: 'tao-train-image-classification',
    desc: '低程式碼影像分類模型微調',
    scenario: '用自己的產品照片微調分類模型，無需從零寫訓練程式碼。',
  },
  {
    cat: 'tao', icon: '🦖', title: 'TAO DINO 偵測', skill: 'tao-train-dino',
    desc: '訓練 DINO 物件偵測模型',
    scenario: '用 TAO 訓練 DINO transformer 偵測模型，達到 SOTA 偵測精度。',
  },
  {
    cat: 'tao', icon: '🔎', title: 'TAO Grounding DINO', skill: 'tao-train-grounding-dino',
    desc: '開放詞彙文字引導偵測',
    scenario: '用文字 prompt「找出所有破損零件」做開放詞彙偵測，免重新標註類別。',
  },
  {
    cat: 'tao', icon: '🧷', title: 'TAO 自動標註', skill: 'tao-train-mask-auto-label',
    desc: '自動產生分割遮罩標註',
    scenario: '只有 bounding box，用 Mask Auto-Label 自動生成像素級分割標註省去人工。',
  },
  {
    cat: 'tao', icon: '🤝', title: 'TAO HuggingFace 微調', skill: 'tao-finetune-huggingface-model',
    desc: '在 TAO 內微調 HF 模型',
    scenario: '把 HuggingFace 上的視覺模型匯入 TAO，用自有資料微調並匯出部署。',
  },
  {
    cat: 'tao', icon: '🧠', title: 'TAO Cosmos Reason', skill: 'tao-finetune-cosmos-reason',
    desc: '微調 Cosmos 視覺推理模型',
    scenario: '微調 Cosmos Reason VLM，讓它能對工業場景做物理常識推理。',
  },
  {
    cat: 'tao', icon: '🚗', title: 'TAO BEVFusion', skill: 'tao-train-bevfusion',
    desc: '多感測器鳥瞰圖 3D 偵測',
    scenario: '融合攝影機與光達訓練 BEVFusion，做自駕車的 3D 物件偵測。',
  },
  {
    cat: 'tao', icon: '🤖', title: 'TAO AutoML', skill: 'tao-run-automl',
    desc: '自動超參數搜尋與模型選擇',
    scenario: '不確定最佳超參數，讓 TAO AutoML 自動搜尋出最佳的模型配置。',
  },

  // ── Physical AI / Omniverse ───────────────
  {
    cat: 'physical', icon: '🌐', title: 'Physical AI 神經重建', skill: 'physical-ai-neural-reconstruction',
    desc: '神經場景重建 — 機器人 RL 模擬',
    scenario: '機器人公司從多角度照片重建工廠 NeRF 3D 場景，用於強化學習環境模擬。',
  },
  {
    cat: 'physical', icon: '🎬', title: 'Physical AI 影片增強', skill: 'physical-ai-video-data-augmentation',
    desc: '合成多樣化影片訓練資料',
    scenario: '對少量真實駕駛影片做天氣、光照變化增強，擴充自駕模型訓練資料。',
  },
  {
    cat: 'physical', icon: '🏗️', title: 'Omniverse CAD→SimReady', skill: 'omniverse-cad-to-simready',
    desc: 'CAD 模型轉模擬就緒資產',
    scenario: '把工廠 CAD 圖檔轉成帶物理屬性的 SimReady USD，導入 Omniverse 模擬。',
  },
  {
    cat: 'physical', icon: '⚡', title: 'Omniverse USD 效能調校', skill: 'omniverse-usd-performance-tuning',
    desc: '大型 USD 場景渲染最佳化',
    scenario: '數位分身場景太大導致渲染卡頓，最佳化 USD 結構提升即時檢視效能。',
  },
]
  .map((s) => ({ ...s, cmd: mk(s.skill) }))

export const SKILLS = [
  ...BASE_SKILLS,
  ...EXTENDED_SKILLS.map((s) => ({ ...s, cmd: s.cmd || mk(s.skill) })),
]

export const CATS = [
  { id: 'all', label: '全部' },
  { id: 'compute', label: 'GPU 計算' },
  { id: 'ai', label: 'AI / LLM' },
  { id: 'deploy', label: '部署 / 推論' },
  { id: 'medical', label: '醫療 AI' },
  { id: 'vision', label: '視覺 AI' },
  { id: 'tao', label: 'TAO Toolkit' },
  { id: 'physical', label: 'Physical AI' },
  { id: 'agent', label: 'Agent / Safety' },
  { id: 'data', label: 'Data / MLOps' },
]

// 我的相關作品
export const PROJECTS = [
  {
    icon: '📁',
    title: 'projects portfolio',
    desc: '依 AI/NVIDIA、3D/遊戲、語言學習、資料儀表板、產品原型、研究硬體分類的個人專案總覽',
    tags: ['Project Index', 'Portfolio', 'GitHub Pages', 'Category Pages'],
    url: '/projects/',
  },
  {
    icon: '🧭',
    title: 'nvidia-agent-skill-labs',
    desc: '55 個 NVIDIA Agent Skills 專案索引頁 + 8 個精選延伸專案 README 作品集地圖',
    tags: ['NVIDIA Skills', 'Portfolio Map', 'AI Infrastructure', 'GitHub Pages'],
    url: '/nvidia-agent-skill-labs/',
  },
  {
    icon: '🚀',
    title: 'nvidia-computex2026-optimizer',
    desc: 'Vera Rubin、Nemotron 3 Ultra 550B、Alpamayo 2 Super 的最佳化工具包',
    tags: ['Roofline', 'NVFP4 量化', 'Dynamo 部署', 'Speculative Decoding'],
    url: 'https://github.com/jjfishjj/nvidia-computex2026-optimizer',
  },
  {
    icon: '🔋',
    title: 'ic-power-efficiency',
    desc: 'IC 晶片節能技術研究 — Clock/Power Gating、DVFS 與 AI 功耗預測',
    tags: ['DVFS', 'Power Gating', 'AI 功耗預測'],
    url: 'https://github.com/jjfishjj/ic-power-efficiency',
  },
]
