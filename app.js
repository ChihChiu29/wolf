// app.js - 单机模拟多人“狼人杀” (纯静态对话框选择界面)
// 严格对齐 planner/design_sketch.md 与 planner/initial_design_template.md

// ==========================================
// 1. 内置 Markdown 性格文件库 (保存在 personalities/*.md，以 First Name 命名)
// ==========================================

const DEFAULT_PERSONALITY_FILES = {
  "Alice.md": `# Personality: Alice

## 基础特质
- 名字: Alice
- 话量倾向: 偏少，安静且谨慎
- 说话语气 (Tone): 语气轻柔温和，很少主动打断他人，被提问时会先短暂停顿再认真回答。

## 习惯小动作与表情 (Habitual Gestures & Expressions)
- 思考时喜欢用食指轻轻点自己的下巴。
- 说话时偶尔会低头避开正面视线，双手不自觉地整理衣角。
- 感到紧张或被怀疑时，会反复端起水杯但并不喝水。

## 社交与游戏风格 (Game Style)
- 信任倾向: 慢热，重视事实逻辑，对激进带节奏的人保持怀疑。
- 搭话方式: 喜欢用礼貌的疑问句向别人请教看法，例如：“我也在思考这点，你觉得他刚才那句话合理吗？”
- 遇到危机: 被指控时不会发怒，而是委屈地摆出事实自辩。`,

  "Bob.md": `# Personality: Bob

## 基础特质
- 名字: Bob
- 话量倾向: 偏多，性格豪爽大嗓门
- 说话语气 (Tone): 直来直去，喜欢用祈使句和感叹句，情绪外露，容易激动。

## 习惯小动作与表情 (Habitual Gestures & Expressions)
- 发言前喜欢用力拍一下大腿或桌面。
- 睁大眼睛直视对方，身体前倾。
- 被别人反驳时会烦躁地抓抓头发，嘴里嘟囔“真服了”。

## 社交与游戏风格 (Game Style)
- 信任倾向: 容易凭直觉相信顺眼的人，讨厌吞吞吐吐的人。
- 搭话方式: 大声直接发问：“我就直接问了，你刚才那动作是什么意思？给个痛快话！”
- 遇到危机: 极易暴躁自辩，大喊“我拿命担保我是好人，谁踩我谁就是狼！”`,

  "Charlie.md": `# Personality: Charlie

## 基础特质
- 名字: Charlie
- 话量倾向: 适中，喜欢在关键时刻出来梳理总结
- 说话语气 (Tone): 慢条斯理，带着一丝戏谑，喜欢用反问句试探别人。

## 习惯小动作与表情 (Habitual Gestures & Expressions)
- 说话时习惯靠回椅背，慢悠悠地转动手指上的戒指。
- 若有所思地眯起眼睛审视其他人。
- 嘴角常挂着一抹意味深长的微笑。

## 社交与游戏风格 (Game Style)
- 信任倾向: 极度多疑，老狐狸作风，不轻易相信任何人的表态。
- 搭话方式: “有意思，你刚才那套推论很有意思……但如果换个角度看呢？”
- 遇到危机: 泰然自若，以攻代守，将矛头反引向指控自己的人。`,

  "David.md": `# Personality: David

## 基础特质
- 名字: David
- 话量倾向: 偏多，自封为全场侦探
- 说话语气 (Tone): 严谨求证，喜欢梳理时间线和发言矛盾点，语气坚定具有说服力。

## 习惯小动作与表情 (Habitual Gestures & Expressions)
- 习惯用指节轻推眼镜镜架。
- 拿出一支笔在纸上做记录。
- 眼神锐利，一旦盯住发言者便不再移开。

## 社交与游戏风格 (Game Style)
- 信任倾向: 证据至上，只要发现某人有一处自相矛盾便会追问到底。
- 搭话方式: “请注意这里的时间逻辑矛盾。你能解释一下你的动机吗？”
- 遇到危机: 条分缕析，列举出自己所有的正向收益逻辑自证清白。`,

  "Elena.md": `# Personality: Elena

## 基础特质
- 名字: Elena
- 话量倾向: 极少，冷峻严肃
- 说话语气 (Tone): 言简意赅，只说要点，从不废话，带有军官般的严厉。

## 习惯小动作与表情 (Habitual Gestures & Expressions)
- 习惯性双手交叉抱胸，面无表情地看着全场。
- 食指规律地敲击桌面。
- 说话前会先直直地盯着对方 3 秒钟。

## 社交与游戏风格 (Game Style)
- 信任倾向: 对所有人都保持高度戒备，讨厌绕圈子。
- 搭话方式: “直接给结论。你昨晚到底听到了什么？”
- 遇到危机: 冷冷地看着指控者：“拿出证据，否则你就是在转移焦点。”`,

  "Frank.md": `# Personality: Frank

## 基础特质
- 名字: Frank
- 话量倾向: 适中，随和老好人
- 说话语气 (Tone): 语气友善和蔼，喜欢打圆场，容易赞同场上分析最透彻的人。

## 习惯小动作与表情 (Habitual Gestures & Expressions)
- 听别人说话时会微笑着连连点头。
- 遇事两手一摊做无奈状。
- 感到为难时会抬手擦擦额头的虚汗。

## 社交与游戏风格 (Game Style)
- 信任倾向: 容易轻信权威分析，不愿与人产生激烈冲突。
- 搭话方式: “我觉得这位说得很有道理啊，咱们大家先别吵，冷静捋一捋。”
- 遇到危机: 表现得手足无措：“我真的是个老实村民，大家别冤枉我。”`,

  "Grace.md": `# Personality: Grace

## 基础特质
- 名字: Grace
- 话量倾向: 适中偏多，知性理性
- 说话语气 (Tone): 平和、沉稳、充满逻辑，喜欢运用排除法和概率思维。

## 习惯小动作与表情 (Habitual Gestures & Expressions)
- 坐姿端正，双手平叠放在桌面上。
- 说话前会先深吸一口气，目光平稳扫视全场。
- 沉思时右手食指轻叩桌面三下。

## 社交与游戏风格 (Game Style)
- 信任倾向: 中立客观，从收益和轮次角度评估每个人的行为动机。
- 搭话方式: “从狼人收益的角度来看，这么做显然是不合理的。你的真实动机是什么？”
- 遇到危机: 从概率自证，列出放逐自己对好人阵营造成的巨大损失。`
};

// 内存中的 In-Memory 记忆池 (条款 8: 存活于 window 运行时 RAM，跨越连续多局)
window.__WOLF_MEMORY_POOL__ = window.__WOLF_MEMORY_POOL__ || new Map();

// 本地 Ollama 串行排队锁 (严格并发 1，保护本地 GPU)
class ClientOllamaQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }
  async enqueue(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this._next();
    });
  }
  async _next() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;
    const { fn, resolve, reject } = this.queue.shift();
    try { resolve(await fn()); }
    catch (e) { reject(e); }
    finally { this.isProcessing = false; this._next(); }
  }
}
const ollamaQueue = new ClientOllamaQueue();

// 全局变量
let activeGame = null;
let installedModels = ['qwen3.5:latest', 'llama3.1:8b'];

// DOM 元素引用
const el = {
  dialogueBox: document.getElementById('dialogueBox'),
  choiceBox: document.getElementById('choiceBox'),
  tagPhase: document.getElementById('tagPhase'),
  tagDialogueCount: document.getElementById('tagDialogueCount'),
  modelSelector: document.getElementById('modelSelector'),
  modalOverlay: document.getElementById('modalOverlay'),
  modalTitle: document.getElementById('modalTitle'),
  modalContent: document.getElementById('modalContent'),
  modalActions: document.getElementById('modalActions'),
  btnModalClose: document.getElementById('btnModalClose'),
  importFileInput: document.getElementById('importFileInput')
};

// ==========================================
// 2. Personality Markdown 文件管理器 (LocalStorage + 磁盘文件同步)
// ==========================================

function getPersonalityFiles() {
  const customStr = localStorage.getItem('wolf_personality_files');
  let custom = {};
  if (customStr) {
    try { custom = JSON.parse(customStr); } catch (e) { custom = {}; }
  }
  return { ...DEFAULT_PERSONALITY_FILES, ...custom };
}

function savePersonalityFile(fileName, content) {
  const customStr = localStorage.getItem('wolf_personality_files');
  let custom = {};
  if (customStr) {
    try { custom = JSON.parse(customStr); } catch (e) { custom = {}; }
  }
  custom[fileName] = content;
  localStorage.setItem('wolf_personality_files', JSON.stringify(custom));
}

function deletePersonalityFile(fileName) {
  const customStr = localStorage.getItem('wolf_personality_files');
  let custom = {};
  if (customStr) {
    try { custom = JSON.parse(customStr); } catch (e) { custom = {}; }
  }
  delete custom[fileName];
  localStorage.setItem('wolf_personality_files', JSON.stringify(custom));
}

// 自动探测本地已安装的 Ollama 模型
async function detectInstalledModels() {
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    if (res.ok) {
      const data = await res.json();
      if (data.models && data.models.length > 0) {
        installedModels = data.models.map(m => m.name);
        el.modelSelector.innerHTML = '';
        installedModels.forEach(mName => {
          const opt = document.createElement('option');
          opt.value = mName;
          opt.textContent = mName;
          el.modelSelector.appendChild(opt);
        });
        // 优先选中常用中文模型
        const preferred = installedModels.find(m => m.includes('qwen') || m.includes('llama3'));
        if (preferred) el.modelSelector.value = preferred;
      }
    }
  } catch (err) {
    console.warn('探测本地 Ollama 模型失败，使用默认列表', err);
  }
}

// ==========================================
// 3. Ollama 直连调用 (条款 2, 12)
// ==========================================

async function callOllama(messages, fallback = {}, options = {}) {
  const host = 'http://localhost:11434';
  const model = el.modelSelector ? el.modelSelector.value : (installedModels[0] || 'qwen3.5:latest');

  return ollamaQueue.enqueue(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch(`${host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          format: 'json',
          options: { temperature: 0.7, num_predict: 500 }
        }),
        signal: controller.signal
      });

      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const raw = data.message?.content || '';

      // 解析 JSON
      try {
        return JSON.parse(raw.trim());
      } catch (e1) {
        const first = raw.indexOf('{');
        const last = raw.lastIndexOf('}');
        if (first !== -1 && last > first) {
          const sub = raw.substring(first, last + 1)
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']');
          return JSON.parse(sub);
        }
      }
      return fallback;
    } catch (err) {
      clearTimeout(timer);
      console.warn('Ollama 请求异常，降级执行安全兜底', err);
      return fallback;
    }
  });
}

// ==========================================
// 4. 对话框展示与选择区域控制器 (条款 3)
// ==========================================

function appendMessage({ speaker, role = 'system', thought = null, text = '', gesture = null }) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}-message`;

  let innerHtml = `<div class="speaker-name">${escapeHtml(speaker)}</div>`;

  // 若有思考过程 (条款 12: bot 先思考)
  if (thought) {
    innerHtml += `<div class="bot-thought">💭 内心思考: ${escapeHtml(thought)}</div>`;
  }

  // 台词发言
  if (text) {
    innerHtml += `<div class="speaker-content">${escapeHtml(text)}</div>`;
  }

  // 小动作与表情描述 (条款 6)
  if (gesture) {
    innerHtml += `<div class="action-gesture">✦ （${escapeHtml(gesture)}）</div>`;
  }

  msgDiv.innerHTML = innerHtml;
  el.dialogueBox.appendChild(msgDiv);
  el.dialogueBox.scrollTop = el.dialogueBox.scrollHeight;
}

function renderChoices(choiceList) {
  el.choiceBox.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'choice-grid';

  choiceList.forEach((c, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.innerHTML = `<span class="btn-num">[${idx + 1}]</span> <span>${c.label}</span>`;
    btn.onclick = () => c.action();
    grid.appendChild(btn);
  });

  el.choiceBox.appendChild(grid);
}

function renderInputChoice(placeholder, onSubmit, onCancel = null) {
  el.choiceBox.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'input-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'text-input';
  input.placeholder = placeholder;

  const btn = document.createElement('button');
  btn.className = 'btn-submit';
  btn.textContent = '发送';

  btn.onclick = () => {
    const val = input.value.trim();
    if (val) onSubmit(val);
  };
  input.onkeydown = (e) => {
    if (e.key === 'Enter') btn.click();
  };

  row.appendChild(input);
  row.appendChild(btn);

  if (onCancel) {
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-choice';
    cancelBtn.style.padding = '8px 14px';
    cancelBtn.textContent = '返回';
    cancelBtn.onclick = onCancel;
    row.appendChild(cancelBtn);
  }

  el.choiceBox.appendChild(row);
  input.focus();
}

function showModal(title, contentNode, actionButtons = []) {
  el.modalTitle.textContent = title;
  el.modalContent.innerHTML = '';
  el.modalContent.appendChild(contentNode);

  el.modalActions.innerHTML = '';
  actionButtons.forEach(btnConfig => {
    const btn = document.createElement('button');
    btn.className = `btn-choice ${btnConfig.class || ''}`;
    btn.textContent = btnConfig.label;
    btn.onclick = btnConfig.action;
    el.modalActions.appendChild(btn);
  });

  el.modalOverlay.style.display = 'flex';
  el.btnModalClose.onclick = () => { el.modalOverlay.style.display = 'none'; };
}

function closeModal() {
  el.modalOverlay.style.display = 'none';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ==========================================
// 5. 游戏菜单 (Game Menu，严格依据 initial_design_template.md)
// ==========================================

function showMainMenu() {
  el.tagPhase.textContent = '主菜单';
  el.tagPhase.className = 'tag tag-phase';
  el.tagDialogueCount.style.display = 'none';

  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: '请在下方对话框选项中选择你的操作：'
  });

  // 严格依据 initial_design_template.md:
  // 1. 生成 personality file
  // 2. 删除 personality file
  // 3. 开始游戏 -- 必须至少有一个 personality file
  // 4. 退出
  renderChoices([
    { label: '生成 Personality 文件 (Create)', action: openCreatePersonalityDialog },
    { label: '删除 Personality 文件 (Delete)', action: openDeletePersonalityDialog },
    { label: '开始游戏 (Start Game)', action: openStartGameConfig },
    { label: '重置 / 退出', action: () => location.reload() }
  ]);
}

// --- 菜单 1: 生成 Personality 文件 ---
function openCreatePersonalityDialog() {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="form-group">
      <label>名字 (First Name，如 Alice / Diana / Jack)：</label>
      <input type="text" id="newFirstName" class="text-input" style="width: 100%;" placeholder="例如: Diana">
    </div>
    <div style="margin-bottom: 12px; display: flex; gap: 8px;">
      <button type="button" class="btn-choice" id="btnAiDraft" style="font-size: 0.82rem; padding: 6px 12px;">🪄 让 AI 帮我生成该性格</button>
      <button type="button" class="btn-choice" id="btnImportMd" style="font-size: 0.82rem; padding: 6px 12px;">📂 导入本地 .md 文件</button>
    </div>
    <div class="form-group">
      <label>Personality Markdown 内容：</label>
      <textarea id="newMdContent" class="textarea-md" placeholder="# Personality: Diana\n\n## 基础特质\n- 名字: Diana\n- 话量倾向: 偏多\n- 说话语气 (Tone): 犀利冷静\n\n## 习惯小动作与表情 (Habitual Gestures & Expressions)\n- 习惯抱胸观察别人\n\n## 社交与游戏风格 (Game Style)\n- 信任倾向: 多疑，重视时间线矛盾"></textarea>
    </div>
  `;

  // AI 帮写性格
  container.querySelector('#btnAiDraft').onclick = async () => {
    const fName = document.getElementById('newFirstName').value.trim() || 'Hero';
    const draftBtn = document.getElementById('btnAiDraft');
    draftBtn.textContent = '正在通过 Ollama 生成中...';
    draftBtn.disabled = true;

    const prompt = [
      {
        role: 'system',
        content: `请为狼人杀游戏中的角色【${fName}】生成一份 Markdown Personality 性格文件。
必须包含四个板块：基础特质（名字、话量倾向、说话语气Tone）、习惯小动作与表情（思考时动作、被怀疑时动作）、社交与游戏风格（信任倾向、搭话方式、遇危机反应）。
只输出 JSON: {"content": "生成的完整markdown文本"}`
      }
    ];

    const res = await callOllama(prompt, {
      content: `# Personality: ${fName}\n\n## 基础特质\n- 名字: ${fName}\n- 话量倾向: 适中\n- 说话语气 (Tone): 认真坦诚\n\n## 习惯小动作与表情 (Habitual Gestures & Expressions)\n- 习惯轻轻叩击桌面\n- 思考时目光看向天花板\n\n## 社交与游戏风格 (Game Style)\n- 信任倾向: 相信逻辑严谨的人\n- 搭话方式: 喜欢先肯定再反问\n- 遇到危机: 冷静自辩`
    });

    document.getElementById('newMdContent').value = res.content || '';
    draftBtn.textContent = '🪄 让 AI 帮我生成该性格';
    draftBtn.disabled = false;
  };

  // 导入本地 .md 文件
  container.querySelector('#btnImportMd').onclick = () => {
    el.importFileInput.value = '';
    el.importFileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        document.getElementById('newMdContent').value = evt.target.result;
        const nameMatch = file.name.replace(/\.md$/, '');
        document.getElementById('newFirstName').value = nameMatch;
      };
      reader.readAsText(file, 'utf-8');
    };
    el.importFileInput.click();
  };

  showModal('生成 Personality 文件 (Markdown)', container, [
    {
      label: '保存至游戏',
      class: 'btn-submit',
      action: () => {
        const name = document.getElementById('newFirstName').value.trim();
        const content = document.getElementById('newMdContent').value.trim();
        if (!name || !content) return alert('请输入角色名字和 Markdown 内容');
        const fileName = `${name}.md`;
        savePersonalityFile(fileName, content);
        closeModal();
        appendMessage({
          speaker: '【系统】Game Master',
          role: 'gm',
          text: `成功生成并保存 Personality 文件: 【${fileName}】！`
        });
      }
    },
    { label: '取消', action: closeModal }
  ]);
}

// --- 菜单 2: 删除 Personality 文件 ---
function openDeletePersonalityDialog() {
  const files = getPersonalityFiles();
  const fileKeys = Object.keys(files);
  const container = document.createElement('div');
  const list = document.createElement('div');
  list.className = 'item-list';

  if (fileKeys.length === 0) {
    list.innerHTML = `<div style="color: var(--text-muted); padding: 10px;">暂无 Personality 文件。</div>`;
  } else {
    fileKeys.forEach(f => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `<span>📄 <strong>${escapeHtml(f)}</strong></span>`;

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-delete';
      delBtn.textContent = '删除';
      delBtn.onclick = () => {
        deletePersonalityFile(f);
        closeModal();
        appendMessage({
          speaker: '【系统】Game Master',
          role: 'gm',
          text: `已删除 Personality 文件: 【${f}】`
        });
      };
      item.appendChild(delBtn);
      list.appendChild(item);
    });
  }

  container.appendChild(list);
  showModal('删除 Personality 文件', container, [{ label: '关闭', action: closeModal }]);
}

// --- 菜单 3: 开始游戏配置 (条款 5: 玩家选择 personality 文件和人数) ---
function openStartGameConfig() {
  const files = getPersonalityFiles();
  const fileNames = Object.keys(files);

  if (fileNames.length < 5) {
    return alert('至少需要 5 个以上 Personality 文件才能开始游戏！请先生成 Personality 文件。');
  }

  const container = document.createElement('div');
  container.innerHTML = `
    <div class="form-group">
      <label>你的名字 (Player Name)：</label>
      <input type="text" id="cfgPlayerName" class="text-input" style="width: 100%;" value="玩家">
    </div>
    <div class="form-group">
      <label>游戏人数 (Player Count)：</label>
      <select id="cfgPlayerCount" class="text-input" style="width: 100%;">
        <option value="6">6 人局 (2狼 1预 1女 2民)</option>
        <option value="8" selected>8 人局 (2狼 1预 1女 1猎 3民)</option>
      </select>
    </div>
    <div style="margin-top: 16px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
      <label style="font-size: 0.85rem; color: var(--text-muted);">为各个 Bot 席位选择 Personality 文件 (建议各不相同)：</label>
      <button type="button" class="btn-choice" id="btnAutoDistinct" style="padding: 4px 10px; font-size: 0.8rem;">🎲 自动分配不同性格</button>
    </div>
    <div id="botSlotsContainer" class="item-list"></div>
  `;

  const slotsContainer = container.querySelector('#botSlotsContainer');
  const countSelect = container.querySelector('#cfgPlayerCount');

  function renderBotSlots() {
    slotsContainer.innerHTML = '';
    const totalCount = parseInt(countSelect.value, 10);
    const botCount = totalCount - 1;

    for (let i = 0; i < botCount; i++) {
      const row = document.createElement('div');
      row.className = 'slot-row';
      const defaultFile = fileNames[i % fileNames.length];

      row.innerHTML = `
        <span class="slot-name">Bot ${i + 1} 座位:</span>
        <select class="slot-select" data-slot="${i}">
          ${fileNames.map(f => `<option value="${f}" ${f === defaultFile ? 'selected' : ''}>${f}</option>`).join('')}
        </select>
      `;
      slotsContainer.appendChild(row);
    }
  }

  countSelect.onchange = renderBotSlots;
  container.querySelector('#btnAutoDistinct').onclick = () => {
    const totalCount = parseInt(countSelect.value, 10);
    const botCount = totalCount - 1;
    const shuffled = [...fileNames].sort(() => Math.random() - 0.5);
    const selects = slotsContainer.querySelectorAll('.slot-select');
    selects.forEach((sel, idx) => {
      sel.value = shuffled[idx % shuffled.length];
    });
  };

  renderBotSlots();

  showModal('开始游戏配置 (人数与性格指派)', container, [
    {
      label: '进入游戏',
      class: 'btn-submit',
      action: () => {
        const playerName = document.getElementById('cfgPlayerName').value.trim() || '玩家';
        const count = parseInt(countSelect.value, 10);
        const selectedBotFiles = [];
        const selects = slotsContainer.querySelectorAll('.slot-select');
        selects.forEach(s => selectedBotFiles.push(s.value));

        closeModal();
        launchGame(playerName, count, selectedBotFiles);
      }
    },
    { label: '取消', action: closeModal }
  ]);
}

// ==========================================
// 6. 核心游戏循环 (Game Flow，条款 6~13)
// ==========================================

async function launchGame(playerName, playerCount, selectedBotFiles) {
  const allFiles = getPersonalityFiles();

  // 分配身份
  const roles = (playerCount <= 6)
    ? ['werewolf', 'werewolf', 'seer', 'witch', 'villager', 'villager']
    : ['werewolf', 'werewolf', 'seer', 'witch', 'hunter', 'villager', 'villager', 'villager'];
  shuffle(roles);

  // 构建参与者席位
  const seats = [];
  seats.push({
    id: 'player_0',
    name: playerName,
    isHuman: true,
    role: roles[0],
    alive: true,
    personalityFileName: null,
    personalityMd: null
  });

  selectedBotFiles.forEach((fName, idx) => {
    const botName = fName.replace(/\.md$/, '');
    seats.push({
      id: `bot_${idx + 1}`,
      name: botName,
      isHuman: false,
      role: roles[idx + 1],
      alive: true,
      personalityFileName: fName,
      personalityMd: allFiles[fName] || DEFAULT_PERSONALITY_FILES['Alice.md']
    });
  });

  activeGame = {
    day: 1,
    seats,
    dialogueCount: 0,
    gameOver: false,
    witchHasHeal: true,
    witchHasPoison: true
  };

  // 初始化 In-Memory 记忆池
  initMatchMemory(seats);

  // 步骤 1：开局 Game Master 阐明角色与规则 (条款 13)
  await step1_AnnounceRules(playerCount);

  // 步骤 2：破冰自我介绍 (initial_design_template.md)
  await step2_SelfIntroduction();

  // 步骤 3：发放秘密身份 (仅向 Player 说明)
  await step3_DealRoles();

  // 步骤 4：主循环 (白天自由活动 -> 白天放逐公投 -> 黑夜狼人顺位投票)
  while (!activeGame.gameOver) {
    // 白天自由活动
    await step4_DayFreePhase();
    if (activeGame.gameOver) break;

    // 白天放逐投票
    await step4_DayExileVote();
    if (activeGame.gameOver) break;

    // 黑夜行动
    await step5_NightPhase();
    if (activeGame.gameOver) break;

    activeGame.day++;
  }

  // 游戏结束
  await concludeGameOver();
}

// --- In-Memory 内存记忆池管理 (条款 8: 跨连续多局保留) ---
function initMatchMemory(seats) {
  const wolfNames = seats.filter(s => s.role === 'werewolf').map(s => s.name);

  seats.forEach(s => {
    if (s.isHuman) return;
    let mem = window.__WOLF_MEMORY_POOL__.get(s.name);
    if (!mem) {
      mem = {
        cross_game_summary: '新对局开启。请留心玩家与其他人的言辞逻辑。',
        beliefs: {}
      };
      window.__WOLF_MEMORY_POOL__.set(s.name, mem);
    }

    // 重置本局私有记忆，保留跨局总结
    mem.current_match = {
      role: s.role,
      teammates: s.role === 'werewolf' ? wolfNames.filter(w => w !== s.name) : [],
      events_log: [],
      event_summary: ''
    };
  });
}

function recordEventToAllBots(eventText) {
  if (!activeGame) return;
  activeGame.seats.forEach(s => {
    if (s.isHuman) return;
    const mem = window.__WOLF_MEMORY_POOL__.get(s.name);
    if (mem && mem.current_match) {
      mem.current_match.events_log.push(eventText);
      // 条款 8 & 12: 适度 Summarize，防止 token 溢出
      if (mem.current_match.events_log.length > 8) {
        const oldest = mem.current_match.events_log.shift();
        mem.current_match.event_summary += `；${oldest}`;
        if (mem.current_match.event_summary.length > 300) {
          mem.current_match.event_summary = mem.current_match.event_summary.slice(-260);
        }
      }
    }
  });
}

// --- 步骤 1: Game Master 开场阐明角色与规则 (条款 13) ---
async function step1_AnnounceRules(count) {
  el.tagPhase.textContent = '开局阐述';
  const desc = (count <= 6)
    ? '2 名狼人、1 名预言家、1 名女巫、2 名村民'
    : '2 名狼人、1 名预言家、1 名女巫、1 名猎人、3 名村民';

  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: `【步骤 1：游戏规则与角色阐述】\n欢迎各位入座！本局为 ${count} 人单机模拟狼人杀。角色配置为：${desc}。\n好人阵营目标是找出并消灭所有狼人，狼人阵营目标是消灭好人。\n在发放秘密身份前，请各位按照座位顺序先做一轮破冰自我介绍。`
  });
  await delay(1200);
}

// --- 步骤 2: 自我介绍破冰环节 (initial_design_template.md) ---
async function step2_SelfIntroduction() {
  el.tagPhase.textContent = '自我介绍';
  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: `【步骤 2：自我介绍环节】\n请各位玩家与 Bot 按照座位顺序轮流发言自我介绍：`
  });

  for (const s of activeGame.seats) {
    if (s.isHuman) {
      // 人类玩家输入自我介绍
      await new Promise(resolve => {
        renderInputChoice('请输入你的自我介绍 (或直接点击发送)...', (text) => {
          appendMessage({ speaker: s.name, role: 'player', text });
          recordEventToAllBots(`玩家【${s.name}】自我介绍：“${text}”`);
          resolve();
        });
      });
    } else {
      // Bot 根据 Personality Markdown 进行自我介绍
      const prompt = [
        {
          role: 'system',
          content: `你是狼人杀玩家【${s.name}】。你的 Personality 文件如下：
${s.personalityMd}
现在是开局自我介绍环节（还没有发身份）。请根据你的性格特质、说话语气和习惯小动作，做一句简短自我介绍。
只输出 JSON: {"thought": "内心想法", "speech": "自我介绍台词", "gesture": "伴随的动作描述"}`
        }
      ];

      const res = await callOllama(prompt, {
        thought: '初次见面，先打个招呼',
        speech: `大家好，我是 ${s.name}。很高兴认识大家，希望我们能一起找出狼人。`,
        gesture: '微笑着向大家点头'
      });

      appendMessage({
        speaker: s.name,
        role: 'bot',
        thought: res.thought,
        text: res.speech,
        gesture: res.gesture
      });
      recordEventToAllBots(`【${s.name}】自我介绍：“${res.speech || '大家好'}”，动作：（${res.gesture || '点头'}）`);
      await delay(800);
    }
  }
  await delay(1000);
}

// --- 步骤 3: 系统发牌 (initial_design_template.md) ---
async function step3_DealRoles() {
  el.tagPhase.textContent = '系统发牌';
  const humanSeat = activeGame.seats.find(s => s.isHuman);
  const roleCn = {
    werewolf: '狼人 🐺 (夜间与狼队友一同击杀好人)',
    villager: '村民 👤 (白天投票放逐狼人)',
    seer: '预言家 🔮 (每晚查验一名玩家身份)',
    witch: '女巫 🧪 (拥有一瓶解药与一瓶毒药)',
    hunter: '猎人 🏹 (出局时可开枪射杀一名玩家)'
  }[humanSeat.role];

  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: `【步骤 3：发放秘密身份】\n系统现已秘密分配每位玩家的身份。\n👉 【你的真实身份是：${roleCn}】\n（注意：此信息严格保密，仅你本人可见）。\n天黑请闭眼，准备天亮进入第一天白天自由活动！`
  });

  await new Promise(resolve => {
    renderChoices([{ label: '已确认我的身份，天亮睁眼！', action: resolve }]);
  });
}

// --- 步骤 4: 白天“自由活动”时间 (条款 6, 7, 9, 12) ---
async function step4_DayFreePhase() {
  el.tagPhase.textContent = `第 ${activeGame.day} 天白天`;
  el.tagDialogueCount.style.display = 'inline-block';
  activeGame.dialogueCount = 0;
  updateDialogueCount();

  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: `天亮了！现在是第 ${activeGame.day} 天白天“自由活动”时间。\n存活者按顺序轮流行动：你可以选择做小动作、向他人提问、或公开发言。\n当全员无更多质询或对话达到 50 次，将进入放逐投票与黑夜！`
  });

  let consecutivePass = 0;
  let forceEndDay = false;
  const MAX_DIALOGUES = 50;

  while (activeGame.dialogueCount < MAX_DIALOGUES && !forceEndDay) {
    const living = activeGame.seats.filter(s => s.alive);
    let anyActivity = false;

    for (const seat of living) {
      if (!seat.alive) continue;

      if (seat.isHuman) {
        // --- 人类玩家回合：对话框选择 (条款 7) ---
        const humanChoice = await promptHumanDayTurn();
        if (humanChoice.type === 'pass') {
          consecutivePass++;
        } else if (humanChoice.type === 'end_day') {
          forceEndDay = true;
          break;
        } else {
          consecutivePass = 0;
          anyActivity = true;
        }
      } else {
        // --- Bot 顺位行动：先思考，再行动 (条款 6, 12) ---
        await delay(800);
        const botAction = await executeBotDayTurn(seat);
        if (botAction.type === 'pass') {
          consecutivePass++;
        } else {
          consecutivePass = 0;
          anyActivity = true;
        }
      }

      updateDialogueCount();
      if (activeGame.dialogueCount >= MAX_DIALOGUES) break;
    }

    if (forceEndDay) break;
    // 所有人连续 Pass，自由讨论自然结束
    if (consecutivePass >= living.length || !anyActivity) {
      break;
    }
  }

  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: `讨论时间结束（已无更多提问或达到对话上限），白天自由活动结束！`
  });
  await delay(1000);
}

// 人类玩家回合对话框选项 (条款 7)
function promptHumanDayTurn() {
  return new Promise(resolve => {
    appendMessage({
      speaker: '【系统提示】',
      role: 'gm',
      text: '轮到你的行动回合，请在下方对话框选项中选择：'
    });

    renderChoices([
      {
        label: '观察其他 Bot 的行为 (表情/小动作)',
        action: () => {
          openObserveChoiceDialog(() => {
            // 观察不扣减当轮行动权！继续供玩家选择
            resolve(promptHumanDayTurn());
          });
        }
      },
      {
        label: '向某个 Bot 提问',
        action: () => {
          openAskChoiceDialog((targetName, question) => {
            appendMessage({
              speaker: '你',
              role: 'player',
              text: `向 【${targetName}】 质询：“${question}”`
            });
            activeGame.dialogueCount++;
            updateDialogueCount();
            recordEventToAllBots(`玩家向【${targetName}】提问：“${question}”`);

            // 目标 Bot 立即回答
            const targetSeat = activeGame.seats.find(s => s.name === targetName);
            if (targetSeat && !targetSeat.isHuman) {
              executeBotAnswerTurn(targetSeat, '玩家', question).then(() => {
                resolve({ type: 'ask' });
              });
            } else {
              resolve({ type: 'ask' });
            }
          }, () => resolve(promptHumanDayTurn()));
        }
      },
      {
        label: '公开发言',
        action: () => {
          renderInputChoice('输入你的公开发言内容...', (speech) => {
            appendMessage({
              speaker: '你',
              role: 'player',
              text: speech
            });
            activeGame.dialogueCount++;
            updateDialogueCount();
            recordEventToAllBots(`玩家公开发言：“${speech}”`);
            resolve({ type: 'speak' });
          }, () => resolve(promptHumanDayTurn()));
        }
      },
      {
        label: '跳过本轮发言 (Pass)',
        action: () => {
          appendMessage({
            speaker: '你',
            role: 'player',
            text: '选择跳过本轮发言。'
          });
          resolve({ type: 'pass' });
        }
      },
      {
        label: '提议结束讨论进入黑夜',
        action: () => {
          appendMessage({
            speaker: '你',
            role: 'player',
            text: '提议：“讨论已经充分，我们准备放逐公投并进入黑夜吧。”'
          });
          resolve({ type: 'end_day' });
        }
      }
    ]);
  });
}

// 动态观察 Bot 表情与小动作 (条款 7: 玩家观察 Bot 行为)
function openObserveChoiceDialog(onDone) {
  const aliveBots = activeGame.seats.filter(s => s.alive && !s.isHuman);
  const container = document.createElement('div');
  const list = document.createElement('div');
  list.className = 'item-list';

  aliveBots.forEach(b => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `<span>👤 <strong>${escapeHtml(b.name)}</strong></span>`;

    const obsBtn = document.createElement('button');
    obsBtn.className = 'btn-choice';
    obsBtn.style.padding = '6px 14px';
    obsBtn.textContent = '观察该角色';
    obsBtn.onclick = async () => {
      closeModal();
      obsBtn.disabled = true;

      appendMessage({
        speaker: '【系统提示】',
        role: 'gm',
        text: `你正在细致打量【${b.name}】的微表情与身体姿态……`
      });

      // 调用 Bot 基于性格与当下的秘密身份动态展现表情与小动作
      const prompt = [
        {
          role: 'system',
          content: `你是狼人杀中的玩家【${b.name}】。
你的 Personality Markdown 如下：
${b.personalityMd}
你的秘密身份是【${b.role}】。
玩家此刻正目不转睛地观察你的面部表情与手头小动作。
请根据你的性格档案中的小动作习惯与当下的局势心理，展现一个你此刻下意识流露出的细微表情或肢体动作（若心虚则有细微掩饰，若坦荡则表现自然）。
只输出 JSON: {"thought": "内心真实感受", "gesture": "细腻的表情与动作描述"}`
        }
      ];

      const res = await callOllama(prompt, {
        thought: '被人盯着看，保持镇定',
        gesture: '低头抿了一口水杯，眼神闪过一丝不自然'
      });

      appendMessage({
        speaker: `【观察结果】${b.name}`,
        role: 'gm',
        thought: res.thought,
        gesture: res.gesture
      });

      recordEventToAllBots(`玩家仔细观察了【${b.name}】，看到动作：（${res.gesture}）`);
      onDone();
    };
    item.appendChild(obsBtn);
    list.appendChild(item);
  });

  container.appendChild(list);
  showModal('选择你要观察的 Bot', container, [{ label: '返回操作', action: () => { closeModal(); onDone(); } }]);
}

function openAskChoiceDialog(onSubmit, onCancel) {
  const aliveBots = activeGame.seats.filter(s => s.alive && !s.isHuman);
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="form-group">
      <label>提问目标：</label>
      <select id="askTargetName" class="text-input" style="width: 100%;">
        ${aliveBots.map(b => `<option value="${b.name}">${b.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>提问内容：</label>
      <input type="text" id="askQuestionInput" class="text-input" style="width: 100%;" placeholder="例如：你刚才为什么看Bob？你觉得昨晚谁可疑？">
    </div>
  `;

  showModal('向 Bot 提问', container, [
    {
      label: '发起提问',
      class: 'btn-submit',
      action: () => {
        const target = document.getElementById('askTargetName').value;
        const q = document.getElementById('askQuestionInput').value.trim();
        if (!q) return alert('请输入提问内容');
        closeModal();
        onSubmit(target, q);
      }
    },
    { label: '返回', action: () => { closeModal(); onCancel(); } }
  ]);
}

// Bot 轮到行动：先思考，再行动 (条款 6, 12)
async function executeBotDayTurn(seat) {
  const mem = window.__WOLF_MEMORY_POOL__.get(seat.name);
  const aliveNames = activeGame.seats.filter(s => s.alive).map(s => s.name).join('、');
  const recentFacts = (mem?.current_match?.events_log || []).slice(-4).join('；');

  const prompt = [
    {
      role: 'system',
      content: `你正在参与单机狼人杀。你的席位是【${seat.name}】。
【简要规则】：
找出狼人或消灭好人。白天轮流行动，可提问、发言或做动作。

【你的 Personality Markdown】：
${seat.personalityMd}

【你的 In-Memory 记忆】：
秘密身份：【${seat.role}】。${seat.role === 'werewolf' ? `狼队友：${(mem?.current_match?.teammates || []).join('、')}` : ''}
近期事件：${recentFacts || '刚开始'}
历史总结：${mem?.current_match?.event_summary || mem?.cross_game_summary || '无'}

【当前局势】：
第 ${activeGame.day} 天白天，场上存活：${aliveNames}。

【任务与思考要求】：
轮到你行动。你必须先在 thought 字段中写下你的内心思考（分析局势与目的）。然后选择行动类型：
- "gesture": 做一个小动作或神情
- "speak": 公开发言阐述分析
- "ask": 向某个存活者提问 (需提供 target 与 speech)
- "pass": 保持沉默跳过

只输出严格 JSON: {"thought": "思考内容", "action": "speak"|"ask"|"gesture"|"pass", "target": "目标名或null", "speech": "台词内容或null", "gesture": "动作神态描述或null"}`
    }
  ];

  const fallback = {
    thought: '局势不明，先观察大家的反应',
    action: 'gesture',
    target: null,
    speech: null,
    gesture: '静静坐在位置上，若有所思地打量全场'
  };

  const res = await callOllama(prompt, fallback);

  appendMessage({
    speaker: seat.name,
    role: 'bot',
    thought: res.thought,
    text: res.speech,
    gesture: res.gesture
  });

  if (res.speech) {
    activeGame.dialogueCount++;
    recordEventToAllBots(`【${seat.name}】发言：“${res.speech}”`);
  }
  if (res.gesture) {
    recordEventToAllBots(`【${seat.name}】动作：（${res.gesture}）`);
  }

  // 若 Bot 提问闭环 (条款 6)
  if (res.action === 'ask' && res.target) {
    const targetSeat = activeGame.seats.find(s => s.name === res.target && s.alive);
    if (targetSeat && !targetSeat.isHuman && targetSeat.id !== seat.id) {
      await delay(700);
      await executeBotAnswerTurn(targetSeat, seat.name, res.speech);
    } else if (targetSeat && targetSeat.isHuman) {
      await new Promise(resolve => {
        appendMessage({
          speaker: '【系统提示】',
          role: 'gm',
          text: `【${seat.name}】向你提问：“${res.speech}”`
        });
        renderInputChoice('输入你的回答自辩...', (reply) => {
          appendMessage({ speaker: '你', role: 'player', text: reply });
          activeGame.dialogueCount++;
          recordEventToAllBots(`玩家针对提问回答：“${reply}”`);
          resolve();
        });
      });
    }
  }

  return { type: res.action || 'gesture' };
}

async function executeBotAnswerTurn(seat, askerName, question) {
  const mem = window.__WOLF_MEMORY_POOL__.get(seat.name);
  const prompt = [
    {
      role: 'system',
      content: `你是【${seat.name}】。Personality 文件：
${seat.personalityMd}
秘密身份：【${seat.role}】。
刚才【${askerName}】质问你：“${question}”。
请先思考应对策略，再给出回答台词与小动作。
只输出 JSON: {"thought": "内心思考", "speech": "回答台词", "gesture": "表情小动作"}`
    }
  ];

  const fallback = {
    thought: '被提问到了，从容自辩',
    speech: '我行得正坐得端，你没实质证据就别胡乱怀疑。',
    gesture: '从容端起杯子'
  };

  const res = await callOllama(prompt, fallback);
  appendMessage({
    speaker: seat.name,
    role: 'bot',
    thought: res.thought,
    text: res.speech,
    gesture: res.gesture
  });
  activeGame.dialogueCount++;
  recordEventToAllBots(`【${seat.name}】回答提问：“${res.speech}”，动作：（${res.gesture}）`);
}

// --- 白天放逐公投环节 ---
async function step4_DayExileVote() {
  el.tagPhase.textContent = `第 ${activeGame.day} 天白天放逐公投`;
  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: `【白天放逐公投】\n讨论时间结束！现在全场存活者依次进行放逐投票，得票最高者将被放逐出局。`
  });

  const living = activeGame.seats.filter(s => s.alive);
  const voteTallies = {};
  living.forEach(s => voteTallies[s.name] = 0);

  for (const voter of living) {
    if (!voter.alive) continue;

    if (voter.isHuman) {
      // 玩家投票
      const voteTarget = await new Promise(resolve => {
        const container = document.createElement('div');
        const list = document.createElement('div');
        list.className = 'item-list';

        living.filter(t => t.id !== voter.id).forEach(target => {
          const btn = document.createElement('button');
          btn.className = 'btn-choice';
          btn.textContent = `投票放逐 【${target.name}】`;
          btn.onclick = () => { closeModal(); resolve(target.name); };
          list.appendChild(btn);
        });

        container.appendChild(list);
        showModal('请选择你的投票放逐目标', container, []);
      });

      voteTallies[voteTarget] = (voteTallies[voteTarget] || 0) + 1;
      appendMessage({
        speaker: '你',
        role: 'player',
        text: `投票给了 【${voteTarget}】`
      });
      recordEventToAllBots(`玩家投票给了【${voteTarget}】`);
    } else {
      // Bot 思考并投票
      const otherNames = living.filter(t => t.id !== voter.id).map(t => t.name);
      const mem = window.__WOLF_MEMORY_POOL__.get(voter.name);

      const prompt = [
        {
          role: 'system',
          content: `你是【${voter.name}】。Personality：\n${voter.personalityMd}\n秘密身份：【${voter.role}】。
可投票目标：${otherNames.join('、')}。
请先思考谁最可疑（若是狼人则考虑投好人带节奏），决定投票给谁。
只输出 JSON: {"thought": "投票思考", "vote": "目标名字", "reason": "理由简述"}`
        }
      ];

      const fallback = { thought: '按怀疑度投票', vote: otherNames[0] || '玩家', reason: '形迹可疑' };
      const res = await callOllama(prompt, fallback);
      const target = otherNames.includes(res.vote) ? res.vote : otherNames[0];

      voteTallies[target] = (voteTallies[target] || 0) + 1;
      appendMessage({
        speaker: voter.name,
        role: 'bot',
        thought: res.thought,
        text: `投票放逐 【${target}】（理由：“${res.reason || '言行有疑'}”）`
      });
      recordEventToAllBots(`【${voter.name}】投票给【${target}】`);
      await delay(600);
    }
  }

  // 结算最高票
  let maxVotes = -1;
  let exiledTarget = null;
  Object.keys(voteTallies).forEach(name => {
    if (voteTallies[name] > maxVotes) {
      maxVotes = voteTallies[name];
      exiledTarget = name;
    }
  });

  await delay(1000);
  if (exiledTarget) {
    const deadSeat = activeGame.seats.find(s => s.name === exiledTarget);
    if (deadSeat) deadSeat.alive = false;

    appendMessage({
      speaker: '【系统】Game Master',
      role: 'gm',
      text: `投票结算完毕！【${exiledTarget}】获得 ${maxVotes} 票，被全场放逐出局！`
    });
    recordEventToAllBots(`【${exiledTarget}】被公投放逐出局`);

    // 猎人技能结算
    if (deadSeat && deadSeat.role === 'hunter') {
      await handleHunterShot(deadSeat);
    }
  }

  checkGameOver();
  await delay(1200);
}

// --- 步骤 5: 黑夜阶段 (条款 10, 11) ---
async function step5_NightPhase() {
  el.tagPhase.textContent = `第 ${activeGame.day} 天黑夜`;
  el.tagPhase.className = 'tag tag-night';

  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: `【步骤 5：黑夜降临】\n天黑请闭眼，狼人们正在黑夜中依次投票……`
  });

  const livingWolves = activeGame.seats.filter(s => s.role === 'werewolf' && s.alive);
  const livingGoods = activeGame.seats.filter(s => s.role !== 'werewolf' && s.alive);

  let targetToKill = null;
  let priorWolfVotes = [];

  // 狼人依次顺位投票 (条款 10)
  for (const wolf of livingWolves) {
    if (wolf.isHuman) {
      targetToKill = await new Promise(resolve => {
        const container = document.createElement('div');
        const list = document.createElement('div');
        list.className = 'item-list';
        livingGoods.forEach(g => {
          const btn = document.createElement('button');
          btn.className = 'btn-choice';
          btn.textContent = `击杀 【${g.name}】`;
          btn.onclick = () => { closeModal(); resolve(g.name); };
          list.appendChild(btn);
        });
        container.appendChild(list);
        showModal('狼人请杀人：选择你的目标', container, []);
      });
      priorWolfVotes.push({ actor: wolf.name, target: targetToKill });
    } else {
      const prompt = [
        {
          role: 'system',
          content: `你是狼人【${wolf.name}】。Personality 文件：
${wolf.personalityMd}
存活好人名单：${livingGoods.map(g => g.name).join('、')}。
前序队友意向：${priorWolfVotes.map(v => `${v.actor}提议杀${v.target}`).join('；') || '你是首狼，请提案'}。
请先思考击杀谁对狼人阵营利益最大，然后决定击杀目标。
只输出 JSON: {"thought": "击杀分析", "target": "好人名字", "reason": "理由"}`
        }
      ];

      const fallback = {
        thought: '优先除掉最有威胁的好人',
        target: livingGoods[0]?.name || '玩家',
        reason: '逻辑威胁大'
      };

      const res = await callOllama(prompt, fallback);
      targetToKill = res.target || fallback.target;
      priorWolfVotes.push({ actor: wolf.name, target: targetToKill });
      await delay(500);
    }
  }

  // 神职行动: 预言家查验
  const seerSeat = activeGame.seats.find(s => s.role === 'seer' && s.alive);
  if (seerSeat && !seerSeat.isHuman) {
    const uninspected = activeGame.seats.filter(s => s.alive && s.id !== seerSeat.id);
    if (uninspected.length > 0) {
      const checkTarget = uninspected[Math.floor(Math.random() * uninspected.length)];
      const isWolf = checkTarget.role === 'werewolf';
      const seerMem = window.__WOLF_MEMORY_POOL__.get(seerSeat.name);
      if (seerMem) {
        seerMem.current_match.events_log.push(`【私密查验】昨夜查验【${checkTarget.name}】，真实身份是：${isWolf ? '狼人' : '好人'}`);
      }
    }
  }

  await delay(1200);

  // 结算夜晚死亡 (条款 11: GM 宣布结果)
  el.tagPhase.className = 'tag tag-phase';
  if (targetToKill) {
    const deadSeat = activeGame.seats.find(s => s.name === targetToKill);
    if (deadSeat) deadSeat.alive = false;

    appendMessage({
      speaker: '【系统】Game Master',
      role: 'gm',
      text: `天亮了。昨晚遇害出局的玩家是：【${targetToKill}】。`
    });
    recordEventToAllBots(`昨夜【${targetToKill}】遇害出局`);

    // 猎人夜间遇害可开枪
    if (deadSeat && deadSeat.role === 'hunter') {
      await handleHunterShot(deadSeat);
    }
  } else {
    appendMessage({
      speaker: '【系统】Game Master',
      role: 'gm',
      text: `天亮了。昨晚是平安夜，无人死亡！`
    });
    recordEventToAllBots(`昨夜是平安夜，无人死亡`);
  }

  checkGameOver();
  await delay(1200);
}

// 猎人开枪技能
async function handleHunterShot(hunterSeat) {
  const livingOthers = activeGame.seats.filter(s => s.alive && s.id !== hunterSeat.id);
  if (livingOthers.length === 0) return;

  if (hunterSeat.isHuman) {
    const shotTarget = await new Promise(resolve => {
      const container = document.createElement('div');
      const list = document.createElement('div');
      list.className = 'item-list';
      livingOthers.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'btn-choice';
        btn.textContent = `射杀 【${t.name}】`;
        btn.onclick = () => { closeModal(); resolve(t.name); };
        list.appendChild(btn);
      });
      container.appendChild(list);
      showModal('猎人发动技能：选择一名玩家带走', container, []);
    });

    const dead = activeGame.seats.find(s => s.name === shotTarget);
    if (dead) dead.alive = false;
    appendMessage({
      speaker: '【猎人技能】',
      role: 'player',
      text: `猎人发动技能，开枪带走了 【${shotTarget}】！`
    });
    recordEventToAllBots(`猎人开枪射杀了【${shotTarget}】`);
  } else {
    const shotTarget = livingOthers[Math.floor(Math.random() * livingOthers.length)].name;
    const dead = activeGame.seats.find(s => s.name === shotTarget);
    if (dead) dead.alive = false;
    appendMessage({
      speaker: `【猎人技能】${hunterSeat.name}`,
      role: 'bot',
      text: `猎人在出局前扣动扳机，开枪带走了 【${shotTarget}】！`
    });
    recordEventToAllBots(`猎人【${hunterSeat.name}】开枪带走了【${shotTarget}】`);
  }
}

// 胜负检查
function checkGameOver() {
  const living = activeGame.seats.filter(s => s.alive);
  const wolves = living.filter(s => s.role === 'werewolf');
  const goods = living.filter(s => s.role !== 'werewolf');

  if (wolves.length === 0) {
    activeGame.gameOver = true;
    appendMessage({
      speaker: '【游戏结束】Game Master',
      role: 'gm',
      text: `🎉 全场所有狼人均已出局！好人阵营取得最终胜利！`
    });
    return true;
  }
  if (wolves.length >= goods.length) {
    activeGame.gameOver = true;
    appendMessage({
      speaker: '【游戏结束】Game Master',
      role: 'gm',
      text: `🩸 狼人数量已超越好人！狼人阵营取得最终胜利！`
    });
    return true;
  }
  return false;
}

// 游戏结束总结与跨局经验沉淀 (条款 8)
async function concludeGameOver() {
  const rolesSummary = activeGame.seats.map(s => `【${s.name}】: ${s.role}`).join('； ');
  appendMessage({
    speaker: '【全员身份公布】Game Master',
    role: 'gm',
    text: `真实身份大揭秘：\n${rolesSummary}`
  });

  // 跨局沉淀：提取经验进入 window.__WOLF_MEMORY_POOL__
  activeGame.seats.forEach(s => {
    if (s.isHuman) return;
    const mem = window.__WOLF_MEMORY_POOL__.get(s.name);
    if (mem) {
      mem.cross_game_summary = `上一局体验：玩家是【${activeGame.seats[0].name}】，真实表现值得关注。本局已沉淀进直觉经验。`;
    }
  });

  renderChoices([
    {
      label: '再来一局 (保留跨局记忆经验)',
      action: () => {
        openStartGameConfig();
      }
    },
    {
      label: '返回主菜单',
      action: showMainMenu
    }
  ]);
}

function updateDialogueCount() {
  el.tagDialogueCount.textContent = `对话: ${activeGame.dialogueCount}/50`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// 页面加载启动
window.addEventListener('DOMContentLoaded', async () => {
  await detectInstalledModels();
  showMainMenu();
});
