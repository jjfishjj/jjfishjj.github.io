const TALENTS = [
  {
    id: "echo",
    icon: "E",
    name: "回音模仿",
    type: "聽覺",
    desc: "先抓語調、節奏與情緒，再跟讀一句關鍵句。",
    tags: ["shadowing", "pronunciation"],
    power: ["listen", "sound", "confidence"],
  },
  {
    id: "chunk",
    icon: "C",
    name: "語塊拼接",
    type: "結構",
    desc: "把句子拆成可替換的語塊，快速重組成自己的說法。",
    tags: ["chunking", "fluency"],
    power: ["structure", "speed", "repair"],
  },
  {
    id: "emotion",
    icon: "M",
    name: "情緒換裝",
    type: "表達",
    desc: "同一句話用禮貌、興奮、冷靜、幽默四種語氣切換。",
    tags: ["tone", "social"],
    power: ["tone", "confidence", "social"],
  },
  {
    id: "memory",
    icon: "R",
    name: "記憶宮殿",
    type: "記憶",
    desc: "把新單字放進地點、人物與動作，讓它變成畫面。",
    tags: ["memory", "visual"],
    power: ["memory", "structure"],
  },
  {
    id: "predict",
    icon: "P",
    name: "預測聽力",
    type: "理解",
    desc: "先猜對方下一句可能說什麼，再聽細節修正。",
    tags: ["listening", "prediction"],
    power: ["listen", "speed"],
  },
  {
    id: "repair",
    icon: "S",
    name: "社交修補",
    type: "互動",
    desc: "聽不懂時不僵住，用確認、重述、請對方換句話說。",
    tags: ["conversation", "repair"],
    power: ["repair", "social", "confidence"],
  },
  {
    id: "story",
    icon: "T",
    name: "故事引擎",
    type: "敘事",
    desc: "用角色、衝突、轉折把單字和句型變成短故事。",
    tags: ["storytelling", "retention"],
    power: ["story", "memory", "tone", "structure"],
  },
  {
    id: "switch",
    icon: "X",
    name: "語言切換",
    type: "彈性",
    desc: "用母語建立概念，再切換成目標語言的自然說法。",
    tags: ["code-switch", "thinking"],
    power: ["structure", "repair", "speed"],
  },
  {
    id: "focus",
    icon: "F",
    name: "專注回合",
    type: "節奏",
    desc: "90 秒只練一個音、一個語塊或一種回應，不分心。",
    tags: ["sprint", "focus"],
    power: ["speed", "sound"],
  },
];

const MISSIONS = [
  {
    scene: "機場轉機",
    title: "我需要在 3 分鐘內改登機門",
    difficulty: "Lv.2",
    prompt: "廣播速度很快，我要聽懂 gate number、時間和方向，並向地勤確認一次。",
    needs: ["listen", "repair", "confidence"],
    goals: ["抓關鍵資訊", "禮貌確認", "避免緊張失語"],
  },
  {
    scene: "咖啡廳社交",
    title: "我想自然加入一段陌生人的聊天",
    difficulty: "Lv.3",
    prompt: "對方在談旅行，我要用一個短故事接話，並保持輕鬆語氣。",
    needs: ["social", "tone", "memory"],
    goals: ["故事開場", "語氣自然", "延伸一個問題"],
  },
  {
    scene: "遊戲公會",
    title: "我需要用英文協調副本戰術",
    difficulty: "Lv.4",
    prompt: "隊友來自不同國家，我要快速說明角色分工、失誤修正和下一回合策略。",
    needs: ["structure", "speed", "repair"],
    goals: ["指令清楚", "快速修正", "降低隊友誤解"],
  },
  {
    scene: "產品面試",
    title: "我想把 AI 專案經驗講得有說服力",
    difficulty: "Lv.4",
    prompt: "面試官問我如何用 AI 改善工作流，我要用具體情境、方法和成果回答。",
    needs: ["structure", "confidence", "tone"],
    goals: ["STAR 回答", "強調成果", "保持專業語氣"],
  },
  {
    scene: "語言交換",
    title: "我聽懂 60%，但要讓對話繼續流動",
    difficulty: "Lv.2",
    prompt: "我不能一直停下查單字，要用預測、重述和追問讓對話不中斷。",
    needs: ["listen", "repair", "speed"],
    goals: ["不要卡住", "確認理解", "延長對話"],
  },
  {
    scene: "短影音錄製",
    title: "我想用外語講一段 30 秒學習心得",
    difficulty: "Lv.3",
    prompt: "我要讓內容有開頭、轉折和一句讓人記得的結尾。",
    needs: ["story", "tone", "confidence"],
    goals: ["內容有節奏", "情緒清楚", "結尾有記憶點"],
  },
];

const PLANS = [
  {
    day: "Day 1",
    title: "耳朵暖身",
    focus: "回音模仿 + 預測聽力",
    detail: "選一段 30 秒短音檔，先猜內容，再跟讀三輪。",
  },
  {
    day: "Day 2",
    title: "語塊重組",
    focus: "語塊拼接 + 語言切換",
    detail: "把三句常用句拆成主詞、動詞、情緒、場景四格。",
  },
  {
    day: "Day 3",
    title: "社交不中斷",
    focus: "社交修補 + 情緒換裝",
    detail: "練習 I mean / What I heard is / Could you say it another way?",
  },
  {
    day: "Day 4",
    title: "故事記憶",
    focus: "記憶宮殿 + 故事引擎",
    detail: "把 8 個新詞放進一個奇怪但清楚的故事。",
  },
  {
    day: "Day 5",
    title: "90 秒挑戰",
    focus: "專注回合 + 回音模仿",
    detail: "只練一個聲音或一個句型，錄音比較第一輪與第三輪。",
  },
  {
    day: "Day 6",
    title: "情境闖關",
    focus: "抽 3 張卡解 1 個任務",
    detail: "用卡牌組合完成一段 45 秒情境回答。",
  },
];

function byId(id) {
  return document.getElementById(id);
}

function sample(array, count) {
  const pool = [...array];
  const picked = [];
  while (picked.length < count && pool.length > 0) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return picked;
}

function calcScore(mission, selected) {
  const powers = selected.flatMap((card) => card.power);
  const matched = mission.needs.filter((need) => powers.includes(need));
  const uniqueTypes = new Set(selected.map((card) => card.type)).size;
  const base = Math.round((matched.length / mission.needs.length) * 74);
  const variety = Math.min(18, uniqueTypes * 6);
  const focus = selected.length === 3 ? 8 : selected.length === 2 ? 4 : 0;
  return Math.min(100, base + variety + focus);
}

function feedbackFor(mission, selected, score) {
  if (selected.length === 0) {
    return [{ type: "warn", text: "先選 2 到 3 張天份卡，再啟動訓練回合。" }];
  }
  const powers = selected.flatMap((card) => card.power);
  const matched = mission.needs.filter((need) => powers.includes(need));
  const missing = mission.needs.filter((need) => !powers.includes(need));
  const lines = matched.map((need) => ({ type: "good", text: `命中能力：${labelPower(need)}，這張組合能處理任務核心。` }));
  if (missing.length) {
    lines.push({ type: "warn", text: `可再補強：${missing.map(labelPower).join("、")}。` });
  }
  if (score >= 84) {
    lines.push({ type: "good", text: "這組卡牌很完整，可以直接做 45 秒口說挑戰。" });
  } else if (score >= 62) {
    lines.push({ type: "good", text: "這組可以完成任務，但建議把回答先拆成三句再開始。" });
  } else {
    lines.push({ type: "warn", text: "這組卡牌偏單一，換一張互動或結構卡會更穩。" });
  }
  return lines;
}

function labelPower(power) {
  return {
    listen: "聽力預測",
    sound: "音感",
    confidence: "自信輸出",
    structure: "句型結構",
    speed: "反應速度",
    repair: "對話修補",
    tone: "語氣控制",
    social: "社交互動",
    memory: "記憶連結",
    story: "故事組織",
  }[power] || power;
}

function createCard(card, selectedIds) {
  const button = document.createElement("button");
  button.className = `talent-card ${selectedIds.has(card.id) ? "selected" : ""}`;
  button.type = "button";
  button.dataset.cardId = card.id;
  button.innerHTML = `
    <div>
      <div class="card-icon">${card.icon}</div>
      <h3>${card.name}</h3>
      <p>${card.desc}</p>
    </div>
    <div class="card-tags">
      <span class="card-tag">${card.type}</span>
      ${card.tags.map((tag) => `<span class="card-tag">${tag}</span>`).join("")}
    </div>
  `;
  return button;
}

function renderMission(mission) {
  byId("missionCard").innerHTML = `
    <div class="mission-top">
      <div class="mission-scene">
        <small>${mission.scene}</small>
        <h3>${mission.title}</h3>
      </div>
      <div class="difficulty">${mission.difficulty}</div>
    </div>
    <p>${mission.prompt}</p>
    <div class="mission-goals">
      ${mission.goals.map((goal) => `<span class="goal-chip">${goal}</span>`).join("")}
    </div>
  `;
}

function renderSelected(selected) {
  const list = byId("selectedList");
  if (!selected.length) {
    list.innerHTML = "<li>尚未選卡。建議選 3 張：理解、結構、輸出各一張。</li>";
    return;
  }
  list.innerHTML = selected.map((card) => `<li>${card.name} <span class="score-chip">${card.type}</span></li>`).join("");
}

function renderResult(mission, selected) {
  const score = calcScore(mission, selected);
  const result = byId("resultBox");
  const feedback = feedbackFor(mission, selected, score);
  result.style.setProperty("--score-width", `${score}%`);
  result.innerHTML = `
    <div class="result-score"><strong>${score}</strong><span>/ 100 組合適配度</span></div>
    <div class="meter"><span></span></div>
    <ul class="feedback-list">
      ${feedback.map((item) => `<li class="${item.type}">${item.text}</li>`).join("")}
    </ul>
  `;
}

function renderStats(mission, selected, rounds) {
  const powers = selected.flatMap((card) => card.power);
  const matched = mission.needs.filter((need) => powers.includes(need)).length;
  byId("statGrid").innerHTML = `
    <div class="stat-card"><strong>${rounds}</strong><span>訓練回合</span></div>
    <div class="stat-card"><strong>${selected.length}</strong><span>目前選卡</span></div>
    <div class="stat-card"><strong>${matched}/${mission.needs.length}</strong><span>任務命中</span></div>
    <div class="stat-card"><strong>${new Set(selected.map((card) => card.type)).size}</strong><span>天份類型</span></div>
  `;
}

function initPractice() {
  const state = {
    mission: MISSIONS[0],
    hand: TALENTS.slice(0, 6),
    selectedIds: new Set(),
    rounds: 0,
  };

  function selectedCards() {
    return TALENTS.filter((card) => state.selectedIds.has(card.id));
  }

  function render() {
    const selected = selectedCards();
    renderMission(state.mission);
    renderSelected(selected);
    renderResult(state.mission, selected);
    renderStats(state.mission, selected, state.rounds);
    byId("talentGrid").innerHTML = "";
    state.hand.forEach((card) => byId("talentGrid").appendChild(createCard(card, state.selectedIds)));
  }

  byId("talentGrid").addEventListener("click", (event) => {
    const card = event.target.closest(".talent-card");
    if (!card) return;
    const id = card.dataset.cardId;
    if (state.selectedIds.has(id)) {
      state.selectedIds.delete(id);
    } else if (state.selectedIds.size < 3) {
      state.selectedIds.add(id);
    }
    render();
  });

  byId("drawMission").addEventListener("click", () => {
    const candidates = MISSIONS.filter((mission) => mission.title !== state.mission.title);
    state.mission = sample(candidates, 1)[0];
    state.selectedIds.clear();
    state.rounds += 1;
    render();
  });

  byId("drawCards").addEventListener("click", () => {
    state.hand = sample(TALENTS, 6);
    state.selectedIds.clear();
    render();
  });

  byId("autoBuild").addEventListener("click", () => {
    state.selectedIds.clear();
    const ranked = TALENTS
      .map((card) => ({
        card,
        hits: state.mission.needs.filter((need) => card.power.includes(need)).length,
      }))
      .sort((a, b) => b.hits - a.hits);
    ranked.slice(0, 3).forEach((item) => state.selectedIds.add(item.card.id));
    state.hand = sample([...ranked.slice(0, 5).map((item) => item.card), ...TALENTS], 6);
    render();
  });

  render();
}

function initPlan() {
  byId("planGrid").innerHTML = PLANS.map((plan) => `
    <article class="plan-card">
      <small>${plan.day}</small>
      <h3>${plan.title}</h3>
      <p><strong>${plan.focus}</strong></p>
      <p>${plan.detail}</p>
    </article>
  `).join("");

  byId("planDeck").innerHTML = TALENTS.map((card) => `
    <li>${card.name} <span class="score-chip">${card.type}</span></li>
  `).join("");

  const mission = MISSIONS[2];
  const selected = [TALENTS[1], TALENTS[5], TALENTS[8]];
  renderMission(mission);
  renderSelected(selected);
  renderResult(mission, selected);
  renderStats(mission, selected, 6);
}

const mode = document.body.dataset.mode;
if (mode === "practice") initPractice();
if (mode === "plan") initPlan();
