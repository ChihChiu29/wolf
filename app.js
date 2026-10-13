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
let isDebugMode = localStorage.getItem('wolf_debug_mode') === 'true';

// DOM 元素引用
const el = {
  dialogueBox: document.getElementById('dialogueBox'),
  choiceBox: document.getElementById('choiceBox'),
  tagPhase: document.getElementById('tagPhase'),
  tagDialogueCount: document.getElementById('tagDialogueCount'),
  modelSelector: document.getElementById('modelSelector'),
  btnToggleDebug: document.getElementById('btnToggleDebug'),
  btnViewLog: document.getElementById('btnViewLog'),
  modalOverlay: document.getElementById('modalOverlay'),
  modalTitle: document.getElementById('modalTitle'),
  modalContent: document.getElementById('modalContent'),
  modalActions: document.getElementById('modalActions'),
  btnModalClose: document.getElementById('btnModalClose'),
  importFileInput: document.getElementById('importFileInput')
};

// 运行时实时日志系统 (支持本地磁盘 game.log 持久化及界面弹窗查看)
window.__WOLF_LOGS__ = window.__WOLF_LOGS__ || [];

function gameLog(type, msg, data = null) {
  const time = new Date().toLocaleTimeString();
  const entry = { time, type, msg, data };
  window.__WOLF_LOGS__.push(entry);
  console.log(`[${time}] [${type}] ${msg}`, data || '');

  // 异步上报至本地轻量服务器，持久化至 game.log 方便排查
  try {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(() => {});
  } catch (e) {}
}

function openLogViewerModal() {
  const container = document.createElement('div');
  container.className = 'log-viewer-container';

  const logBox = document.createElement('div');
  logBox.className = 'log-viewer-box';

  const logs = window.__WOLF_LOGS__ || [];
  if (logs.length === 0) {
    logBox.innerHTML = '<div style="color: #6c7789; text-align: center; padding: 25px 0;">暂无游戏运行日志。<br>开始游戏后，身份分配、发言、放逐公投、猎人开枪及胜负核验均会在此实时记录。</div>';
  } else {
    logBox.innerHTML = logs.map(entry => {
      const dataStr = entry.data ? `<span class="log-data">${escapeHtml(typeof entry.data === 'object' ? JSON.stringify(entry.data) : String(entry.data))}</span>` : '';
      return `<div class="log-row">
        <span class="log-time">[${escapeHtml(entry.time)}]</span>
        <span class="log-type">[${escapeHtml(entry.type)}]</span>
        <span class="log-msg">${escapeHtml(entry.msg)}</span>
        ${dataStr}
      </div>`;
    }).join('');
  }

  container.appendChild(logBox);

  showModal('📜 游戏运行与判决日志 (Realtime Game Logs)', container, [
    {
      label: '📋 复制全部日志',
      action: () => {
        const text = (window.__WOLF_LOGS__ || []).map(e => `[${e.time}] [${e.type}] ${e.msg} ${e.data ? JSON.stringify(e.data) : ''}`).join('\n');
        navigator.clipboard.writeText(text).then(() => {
          alert('全部运行日志已成功复制到剪贴板！');
        }).catch(() => {
          prompt('请全选复制日志内容：', text);
        });
      }
    },
    {
      label: '清空日志',
      action: () => {
        window.__WOLF_LOGS__ = [];
        closeModal();
      }
    },
    {
      label: '关闭',
      action: closeModal
    }
  ]);

  setTimeout(() => {
    logBox.scrollTop = logBox.scrollHeight;
  }, 50);
}

function getRoleCn(role) {
  const map = {
    werewolf: '🐺 狼人',
    villager: '👨‍🌾 平民',
    seer: '🔮 预言家',
    witch: '🧪 女巫',
    hunter: '🏹 猎人'
  };
  return map[role] || role;
}

function updateDebugModeUI() {
  const btn = el.btnToggleDebug || document.getElementById('btnToggleDebug');
  if (isDebugMode) {
    document.body.classList.add('debug-mode');
    if (btn) {
      btn.innerHTML = '<span class="debug-dot"></span><span>调试: 开</span>';
      btn.classList.add('active');
    }
  } else {
    document.body.classList.remove('debug-mode');
    if (btn) {
      btn.innerHTML = '<span class="debug-dot"></span><span>调试: 关</span>';
      btn.classList.remove('active');
    }
  }
}

function toggleDebugMode() {
  isDebugMode = !isDebugMode;
  localStorage.setItem('wolf_debug_mode', isDebugMode);
  updateDebugModeUI();
  gameLog('调试模式', isDebugMode ? '开启调试 (暴露思考)' : '关闭调试 (隐藏思考)');
  appendMessage({
    speaker: '【系统提示】',
    role: 'gm',
    text: isDebugMode ? '🐞 调试模式已开启：Bot 内心思考已向您公开展示。' : '🔒 调试模式已关闭：所有 Bot 内心思考已隐去，恢复正常探案体验。'
  });
}


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
          opt.textContent = mName.length > 20 ? mName.slice(0, 18) + '…' : mName;
          opt.title = mName;
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
    const timer = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(`${host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          format: 'json',
          think: false, // 禁用长推理链，直接生成规范的目标 JSON
          options: {
            temperature: 0.7,
            num_predict: 800
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      let raw = data.message?.content || '';

      // 若 content 为空且模型在 thinking 中输出了内容，则尝试从 thinking 提取
      if (!raw.trim() && data.message?.thinking) {
        raw = data.message.thinking;
      }

      // 解析 JSON
      try {
        const parsed = JSON.parse(raw.trim());
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e1) {
        const first = raw.indexOf('{');
        const last = raw.lastIndexOf('}');
        if (first !== -1 && last > first) {
          const sub = raw.substring(first, last + 1)
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']');
          const parsed = JSON.parse(sub);
          if (parsed && typeof parsed === 'object') return parsed;
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
// 3.1 绝不千篇一律的人格化兜底生成器 (防脱机或异常时的生动表达)
// ==========================================

function getBotPersonalityFallback(seat, type, extra = {}) {
  const name = seat.name || 'Bot';
  const role = seat.role || 'villager';
  const md = seat.personalityMd || '';

  const presets = {
    Alice: {
      intro: {
        thought: '大家都看着我……稍微有点紧张，先少说两句，观察事实逻辑。',
        speech: '大家好……我是 Alice。希望这局大家能多看事实逻辑，我会认真听大家的分析。',
        gesture: '低头避开正面视线，双手不自觉地整理了一下衣角'
      },
      observe: {
        thought: role === 'werewolf' ? '有点紧张，千万别露出破绽。' : '默默观察局势，不想引起怀疑。',
        gesture: role === 'werewolf' ? '反复端起水杯但并没有喝，食指轻点下巴，神色拘谨' : '安静坐着，用食指轻轻点着下巴思考'
      },
      act: {
        thought: '尽量温和自辩，寻找逻辑漏洞。',
        speech: '我也在思考刚才的发言，逻辑上似乎有些疑问……大家觉得呢？',
        gesture: '双手轻轻整理衣角，语气轻柔谨慎'
      },
      answer: {
        thought: '被提问到了，短暂停顿后认真回答。',
        speech: `关于刚才的问题，我确实没有做多余的事，大家可以核对我的发言逻辑。`,
        gesture: '短暂停顿了一下，双手交叠认真作答'
      }
    },
    Bob: {
      intro: {
        thought: '全场都在装深沉，我得直接把气氛炒热，谁装神弄鬼就干谁！',
        speech: '我是 Bob！我就直说了，大家痛快点玩，谁要是吞吞吐吐、话里有话，我第一个咬死他！',
        gesture: '用力拍了一下桌面，身体前倾，睁大眼睛直视全场'
      },
      observe: {
        thought: role === 'werewolf' ? '要是有人怀疑我，我就大嗓门顶回去！' : '直肠子一个，谁可疑我看谁。',
        gesture: role === 'werewolf' ? '有些烦躁地抓了抓头发，嘴里嘟囔了一句，眼神直直瞪回来' : '大刺刺地靠在椅子上，眼神直视全场，抖了下腿'
      },
      act: {
        thought: '看不惯墨迹的人，直接发问！',
        speech: '我就直问了，大家给个痛快话，刚才那番遮遮掩掩到底是什么意思？',
        gesture: '猛拍了一下大腿，声音洪亮'
      },
      answer: {
        thought: '被指控了，直接暴躁自辩！',
        speech: `你问我动机？我拿命担保我是好人，谁踩我谁就是狼！`,
        gesture: '情绪激动地身体前倾，瞪大眼睛直视对方'
      }
    },
    Charlie: {
      intro: {
        thought: '有意思，一个个都在试探，先看看这帮人怎么表演。',
        speech: '各位好，我是 Charlie。别急着表白身份，慢慢盘，时间还长着呢……',
        gesture: '慢悠悠地转动着手指上的戒指，嘴角挂着一丝戏谑的笑意'
      },
      observe: {
        thought: role === 'werewolf' ? '泰然自若，越是放松好人越看不透。' : '审视全场，寻找狼人的漏洞。',
        gesture: role === 'werewolf' ? '慢条斯理地转着戒指，嘴角带着笑意，但眼角余光快速扫过大家' : '靠回椅背，若有所思地眯起眼睛审视其他人'
      },
      act: {
        thought: '以攻代守，抛出反问试探别人。',
        speech: '有意思，刚才那套推论很有意思……但如果换个角度看，收益最大的会是谁呢？',
        gesture: '转动左手食指上的戒指，眼神深邃'
      },
      answer: {
        thought: '老狐狸作风，反问化解质询。',
        speech: `你这么急着把矛头引向我，是真在找狼，还是在替真正的狼人转移视线？`,
        gesture: '嘴角微扬，似笑非笑地看着提问者'
      }
    },
    David: {
      intro: {
        thought: '从现在开始建立每个人的发言档案和时间线矛盾。',
        speech: '我是 David。这局由我来记录全场的时间线与逻辑漏洞，奉劝狼人别露出破绽。',
        gesture: '用指节轻推眼镜镜架，拿出一支笔在纸上认真做记录'
      },
      observe: {
        thought: role === 'werewolf' ? '得装出专心记录的样子掩饰自己的身份。' : '盯着发言人，捕捉矛盾。',
        gesture: role === 'werewolf' ? '在纸上快速写画，推了推眼镜，目光快速闪烁了一下' : '眼神锐利盯住全场，指节推了推眼镜架'
      },
      act: {
        thought: '梳理矛盾，证据至上。',
        speech: '请注意前后的发言逻辑。我们必须严格根据收益和行为轨迹来判断。',
        gesture: '用笔尖轻敲笔记本，神情严肃'
      },
      answer: {
        thought: '条分缕析，列举自证。',
        speech: `既然你问到了这一点，请看我的逻辑链条，我前面的所有行为均完全符合好人利益。`,
        gesture: '推了推眼镜，目光笃定地与提问者对视'
      }
    },
    Elena: {
      intro: {
        thought: '别让我抓到任何废话和虚伪的表演。',
        speech: 'Elena。发言直接给结论，别浪费大家时间。',
        gesture: '双手交叉抱胸，面无表情、眼神凌厉地扫视全场'
      },
      observe: {
        thought: role === 'werewolf' ? '保持冷峻，绝对不能慌乱。' : '冷眼旁观，不放过任何破绽。',
        gesture: role === 'werewolf' ? '抱胸站直，食指快速敲击了手肘两下，神情冰冷' : '双手抱胸，直直地盯着对方，面无表情'
      },
      act: {
        thought: '直切要害，绝不拖泥带水。',
        speech: '直接给结论。谁在跟风，谁在划水，大家心里都有数。',
        gesture: '食指有规律地敲击桌面，神色冷峻'
      },
      answer: {
        thought: '冷冷回应，要证据。',
        speech: `拿出证据来。如果没有证据，你现在的质询就是在转移焦点。`,
        gesture: '冷冷地凝视着提问者 3 秒钟'
      }
    },
    Frank: {
      intro: {
        thought: '大家火药味别太浓啊，我可不想被当靶子。',
        speech: '大家好啊，我是 Frank。大家别吵别急，心平气和地捋逻辑，我肯定跟着靠谱的人走！',
        gesture: '微笑着连连点头，两手一摊做随和状，擦了擦额头的虚汗'
      },
      observe: {
        thought: role === 'werewolf' ? '手心有点冒汗，希望别被揪住。' : '希望大家别冤枉我这个老实人。',
        gesture: role === 'werewolf' ? '抬手用手帕擦了擦额头的虚汗，笑容略显僵硬' : '听别人说话时微笑着连连点头，遇事两手一摊'
      },
      act: {
        thought: '打圆场，求同存异。',
        speech: '我觉得大家先别互相猜忌，冷静梳理一下时间线，咱们好人不能内讧啊。',
        gesture: '双手抬起做安抚状，满脸诚恳'
      },
      answer: {
        thought: '手足无措，诚恳求信任。',
        speech: `哎呀别怀疑我啊，我真的是个老实村民，大家可千万别误伤好人！`,
        gesture: '连连摆手，掏出手帕擦了擦汗'
      }
    },
    Grace: {
      intro: {
        thought: '开局信息量为零，必须从收益和概率角度保持中立观察。',
        speech: '我是 Grace。从博弈收益和概率角度分析，盲目站边是不明智的，期待大家的严谨发言。',
        gesture: '双手平叠放在桌面上，深吸一口气平稳扫视众人'
      },
      observe: {
        thought: role === 'werewolf' ? '保持理性外表，计算投票概率。' : '中立客观评估动机。',
        gesture: role === 'werewolf' ? '双手平叠，沉思时食指轻叩桌面，眼神掠过天花板后恢复平稳' : '坐姿端正，双手平叠放在桌面上，目光平稳扫视全场'
      },
      act: {
        thought: '从收益角度推演狼人动机。',
        speech: '从收益角度分析，狼人阵营在这个阶段的利益最大化做法是什么？我们可以从这一点倒推。',
        gesture: '右手食指在桌面上轻叩三下，条理清晰'
      },
      answer: {
        thought: '用概率思维自证清白。',
        speech: `放逐我对好人阵营没有任何正向收益，反而会丢失关键轮次。请重新评估你的假设。`,
        gesture: '平稳深吸一口气，从容对答'
      }
    }
  };

  if (presets[name] && presets[name][type]) {
    return presets[name][type];
  }

  // 自定义角色：从 Markdown 中提取语气与动作
  const lines = md.split('\n');
  let tone = '认真谨慎';
  let habit = '若有所思地看着大家';
  for (const l of lines) {
    if (l.includes('Tone') || l.includes('语气')) tone = l.replace(/.*[:：]/, '').trim();
    if (l.includes('小动作') || l.includes('表情') || l.includes('习惯')) habit = l.replace(/.*[:：]/, '').trim();
  }

  if (type === 'intro') {
    return {
      thought: `亮明我【${name}】的鲜明态度，按照【${tone}】的语气开场。`,
      speech: `各位好，我是 ${name}。这局游戏请大家多拿出真凭实据，我会紧盯发言漏洞。`,
      gesture: habit.slice(0, 30) || '向众人微一致意'
    };
  } else if (type === 'observe') {
    return {
      thought: role === 'werewolf' ? '注意表情管理，别露出马脚。' : '保持常态观察。',
      gesture: habit.slice(0, 30) || '静静地坐在位置上打量众人'
    };
  } else if (type === 'answer') {
    return {
      thought: '针对质问从容自辩。',
      speech: `关于提问，我行得正坐得端，在没有真凭实据前请不要乱扣帽子。`,
      gesture: habit.slice(0, 30) || '神情自若'
    };
  } else {
    return {
      thought: '按既定方针行事。',
      action: 'gesture',
      target: null,
      speech: null,
      gesture: habit.slice(0, 30) || '静静思考'
    };
  }
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

// 经典狼人杀板子配置定义 (解决神职过多与阵营平衡性问题)
const BOARD_CONFIGS = {
  '8_std': {
    name: '8 人标准平衡局 (推荐：2狼 1预 1女 4民)',
    desc: '2 名狼人、1 名预言家、1 名女巫、4 名平民',
    count: 8,
    roles: ['werewolf', 'werewolf', 'seer', 'witch', 'villager', 'villager', 'villager', 'villager']
  },
  '8_hunter': {
    name: '8 人进阶三神局 (2狼 1预 1女 1猎 3民)',
    desc: '2 名狼人、1 名预言家、1 名女巫、1 名猎人、3 名平民',
    count: 8,
    roles: ['werewolf', 'werewolf', 'seer', 'witch', 'hunter', 'villager', 'villager', 'villager']
  },
  '8_3wolves': {
    name: '8 人强强对决局 (3狼 1预 1女 1猎 2民)',
    desc: '3 名狼人、1 名预言家、1 名女巫、1 名猎人、2 名平民',
    count: 8,
    roles: ['werewolf', 'werewolf', 'werewolf', 'seer', 'witch', 'hunter', 'villager', 'villager']
  },
  '6_casual': {
    name: '6 人微型娱乐局 (2狼 1预 1女 2民)',
    desc: '2 名狼人、1 名预言家、1 名女巫、2 名平民',
    count: 6,
    roles: ['werewolf', 'werewolf', 'seer', 'witch', 'villager', 'villager']
  }
};

// --- 菜单 3: 开始游戏配置 (条款 5: 玩家选择 personality 文件和板子配置) ---
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
      <label>板子规则与角色配置 (Board Setup)：</label>
      <select id="cfgBoardKey" class="text-input" style="width: 100%;">
        <option value="8_std" selected>8 人标准平衡局 (2狼 1预 1女 4民 - 推荐平衡)</option>
        <option value="8_hunter">8 人进阶三神局 (2狼 1预 1女 1猎 3民 - 特殊神职较多)</option>
        <option value="8_3wolves">8 人强强对决局 (3狼 1预 1女 1猎 2民 - 狼人战术配合)</option>
        <option value="6_casual">6 人微型娱乐局 (2狼 1预 1女 2民)</option>
      </select>
    </div>
    <div class="form-group" style="margin-top: 8px;">
      <label style="cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-main);">
        <input type="checkbox" id="cfgRevealOnDeath" checked>
        <span>开启“出局亮牌/翻牌模式”（出局时公报身份，推荐开启以杜绝判决疑惑）</span>
      </label>
    </div>
    <div style="margin-top: 16px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
      <label style="font-size: 0.85rem; color: var(--text-muted);">为各个 Bot 席位指派 Personality 文件：</label>
      <button type="button" class="btn-choice" id="btnAutoDistinct" style="padding: 4px 10px; font-size: 0.8rem;">🎲 自动分配不同性格</button>
    </div>
    <div id="botSlotsContainer" class="item-list"></div>
  `;

  const slotsContainer = container.querySelector('#botSlotsContainer');
  const boardSelect = container.querySelector('#cfgBoardKey');

  function renderBotSlots() {
    slotsContainer.innerHTML = '';
    const boardKey = boardSelect.value;
    const board = BOARD_CONFIGS[boardKey] || BOARD_CONFIGS['8_std'];
    const botCount = board.count - 1;

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

  boardSelect.onchange = renderBotSlots;
  container.querySelector('#btnAutoDistinct').onclick = () => {
    const boardKey = boardSelect.value;
    const board = BOARD_CONFIGS[boardKey] || BOARD_CONFIGS['8_std'];
    const botCount = board.count - 1;
    const shuffled = [...fileNames].sort(() => Math.random() - 0.5);
    const selects = slotsContainer.querySelectorAll('.slot-select');
    selects.forEach((sel, idx) => {
      sel.value = shuffled[idx % shuffled.length];
    });
  };

  renderBotSlots();

  showModal('开始游戏配置 (板子选择与性格指派)', container, [
    {
      label: '进入游戏',
      class: 'btn-submit',
      action: () => {
        const playerName = document.getElementById('cfgPlayerName').value.trim() || '玩家';
        const boardKey = boardSelect.value;
        const revealOnDeath = document.getElementById('cfgRevealOnDeath').checked;
        const selectedBotFiles = [];
        const selects = slotsContainer.querySelectorAll('.slot-select');
        selects.forEach(s => selectedBotFiles.push(s.value));

        closeModal();
        launchGame(playerName, boardKey, revealOnDeath, selectedBotFiles);
      }
    },
    { label: '取消', action: closeModal }
  ]);
}

// ==========================================
// 6. 核心游戏循环 (Game Flow，条款 6~13)
// ==========================================

async function launchGame(playerName, boardKey, revealOnDeath, selectedBotFiles) {
  const allFiles = getPersonalityFiles();
  const board = BOARD_CONFIGS[boardKey] || BOARD_CONFIGS['8_std'];

  // 分配身份
  const roles = [...board.roles];
  shuffle(roles);

  // 构建参与者席位
  const seats = [];
  seats.push({
    id: 'player_0',
    name: playerName,
    isHuman: true,
    role: roles[0],
    alive: true,
    deathReason: null,
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
      deathReason: null,
      personalityFileName: fName,
      personalityMd: allFiles[fName] || DEFAULT_PERSONALITY_FILES['Alice.md']
    });
  });

  activeGame = {
    day: 1,
    board,
    revealOnDeath,
    seats,
    dialogueCount: 0,
    gameOver: false,
    witchHasHeal: true,
    witchHasPoison: true
  };

  gameLog('游戏开局', `板子: 【${board.name}】 | 出局翻牌: ${revealOnDeath ? '开启' : '关闭'}`, {
    rolesDealt: seats.map(s => `${s.name}: ${s.role}`)
  });

  // 初始化 In-Memory 记忆池
  initMatchMemory(seats);

  // 步骤 1：开局 Game Master 阐明角色与规则 (条款 13)
  await step1_AnnounceRules();

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
async function step1_AnnounceRules() {
  el.tagPhase.textContent = '开局阐述';
  const board = activeGame.board || BOARD_CONFIGS['8_std'];
  const modeText = activeGame.revealOnDeath ? '【出局亮牌模式】（出局时法官将公布其真实身份）' : '【标准暗牌模式】（出局不翻牌，游戏结束时统一揭秘）';

  appendMessage({
    speaker: '【系统】Game Master',
    role: 'gm',
    text: `【步骤 1：游戏规则与角色阐述】\n欢迎入座！本局采用：${board.name}。\n角色配置为：${board.desc}。\n牌局规则：本局采用 ${modeText}。\n好人阵营目标是找出并放逐所有狼人，狼人阵营目标是消灭好人。\n在发放秘密身份前，请各位按照座位顺序先做一轮破冰自我介绍。`
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
      // Bot 根据 Personality Markdown 进行自我介绍 (条款 6, 12)
      const prompt = [
        {
          role: 'system',
          content: `你正在参与单机狼人杀，扮演玩家【${s.name}】。\n你的 Personality 性格档案如下：\n${s.personalityMd}`
        },
        {
          role: 'user',
          content: `现在是开局自我介绍破冰环节（尚未发放身份）。
请严格根据你的性格特质、说话语气（Tone）与习惯小动作，做一句符合你个人性格的自我介绍。
【核心要求】：
1. 严禁使用“大家好，我是xx，很高兴认识大家，希望一起找出狼人”这类平庸千篇一律的废话套话！
2. 必须体现出你独一无二的语气口癖、性格态度和标志性小动作！
3. 必须输出严格 JSON 格式：
{"thought": "内心真实想法", "speech": "极具个性的自我介绍台词", "gesture": "伴随的细微小动作或神态"}`
        }
      ];

      const fallback = getBotPersonalityFallback(s, 'intro');
      const res = await callOllama(prompt, fallback);

      appendMessage({
        speaker: s.name,
        role: 'bot',
        thought: res.thought,
        text: res.speech,
        gesture: res.gesture
      });
      recordEventToAllBots(`【${s.name}】自我介绍：“${res.speech || '亮明态度'}”，动作：（${res.gesture || '展示习惯动作'}）`);

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
          content: `你是狼人杀中的玩家【${b.name}】。\n你的 Personality 档案如下：\n${b.personalityMd}\n你的秘密身份是【${b.role}】。`
        },
        {
          role: 'user',
          content: `玩家此刻正目不转睛地审视你的面部表情与手部小动作。\n请根据你的性格档案中的小动作习惯与当下的局势心理（秘密身份是【${b.role}】），展现一个你此刻下意识流露出的细微表情或肢体动作。\n只输出严格 JSON: {"thought": "内心真实感受", "gesture": "细腻的表情与动作描述"}`
        }
      ];

      const fallback = getBotPersonalityFallback(b, 'observe');
      const res = await callOllama(prompt, fallback);


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

  const fallback = getBotPersonalityFallback(seat, 'act');
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
      content: `你正在玩狼人杀，你的席位是【${seat.name}】。\nPersonality 档案：\n${seat.personalityMd}\n秘密身份：【${seat.role}】。`
    },
    {
      role: 'user',
      content: `刚才【${askerName}】质问你：“${question}”。\n请先思考应对策略（根据你的性格与秘密身份），再给出具有你专属语气与动作的回答台词。\n只输出严格 JSON: {"thought": "内心思考", "speech": "回答台词", "gesture": "表情小动作"}`
    }
  ];

  const fallback = getBotPersonalityFallback(seat, 'answer', { question });
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
        text: `投票放逐 【${voteTarget}】`
      });
      recordEventToAllBots(`玩家投票放逐【${voteTarget}】`);
    } else {
      // Bot 思考并投票
      const otherNames = living.filter(t => t.id !== voter.id).map(t => t.name);
      const mem = window.__WOLF_MEMORY_POOL__.get(voter.name);

      const prompt = [
        {
          role: 'system',
          content: `你是【${voter.name}】。Personality 档案：\n${voter.personalityMd}\n秘密身份：【${voter.role}】。`
        },
        {
          role: 'user',
          content: `当前进入白天放逐公投环节。
存活可投票目标：${otherNames.join('、')}。
请先在内心深处思考（thought）分析谁最可疑（若你是狼人则考虑找好人抗推带节奏），决定你要投票放逐的目标名字（vote），以及你的真实内心动机（reason）。
只输出严格 JSON: {"thought": "投票心路与局势权衡", "vote": "目标名字", "reason": "投票真实动机"}`
        }
      ];

      const fallback = { thought: '按白天的怀疑度投票', vote: otherNames[0] || '玩家', reason: '言行形迹可疑' };
      const res = await callOllama(prompt, fallback);
      const target = otherNames.includes(res.vote) ? res.vote : otherNames[0];

      voteTallies[target] = (voteTallies[target] || 0) + 1;

      const fullThought = [
        res.thought,
        res.reason ? `动机: ${res.reason}` : null
      ].filter(Boolean).join(' | ');

      appendMessage({
        speaker: voter.name,
        role: 'bot',
        thought: fullThought || res.thought,
        text: `投票放逐 【${target}】`
      });
      recordEventToAllBots(`【${voter.name}】投票放逐【${target}】`);
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
    if (deadSeat) {
      deadSeat.alive = false;
      deadSeat.deathReason = `第 ${activeGame.day} 天白天被公投放逐出局 (获得 ${maxVotes} 票)`;
    }

    const revealText = activeGame.revealOnDeath && deadSeat ? `（真实身份：${getRoleCn(deadSeat.role)}）` : '';
    appendMessage({
      speaker: '【系统】Game Master',
      role: 'gm',
      text: `投票结算完毕！【${exiledTarget}】获得 ${maxVotes} 票，被全场放逐出局！${revealText}`
    });
    recordEventToAllBots(`【${exiledTarget}】被公投放逐出局`);
    gameLog('放逐结果', `【${exiledTarget}】被公投放逐出局 (${deadSeat?.role})，得票: ${maxVotes}`, { tallies: voteTallies });

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

  gameLog('黑夜开始', `第 ${activeGame.day} 天夜间开始，存活狼人: ${livingWolves.map(w => w.name).join('、')}`);

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

  gameLog('狼人决议', `狼人最终目标: 【${targetToKill}】`, { priorWolfVotes });

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
      gameLog('预言家查验', `Bot预言家【${seerSeat.name}】查验【${checkTarget.name}】，身份为: ${isWolf ? '狼人' : '好人'}`);
    }
  }

  await delay(1200);

  // 结算夜晚死亡 (条款 11: GM 宣布结果)
  el.tagPhase.className = 'tag tag-phase';
  if (targetToKill) {
    const deadSeat = activeGame.seats.find(s => s.name === targetToKill);
    if (deadSeat) {
      deadSeat.alive = false;
      deadSeat.deathReason = `第 ${activeGame.day} 天夜间被狼人击杀出局`;
    }

    const revealText = activeGame.revealOnDeath && deadSeat ? `（真实身份：${getRoleCn(deadSeat.role)}）` : '';
    appendMessage({
      speaker: '【系统】Game Master',
      role: 'gm',
      text: `天亮了。昨晚遇害出局的玩家是：【${targetToKill}】${revealText}。`
    });
    recordEventToAllBots(`昨夜【${targetToKill}】遇害出局`);
    gameLog('夜间结算', `【${targetToKill}】遇害出局 (${deadSeat?.role})`);

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
    gameLog('夜间结算', '昨夜是平安夜');
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
    if (dead) {
      dead.alive = false;
      dead.deathReason = `第 ${activeGame.day} 天被猎人【玩家】开枪带走出局`;
    }
    const revealText = activeGame.revealOnDeath && dead ? `（真实身份：${getRoleCn(dead.role)}）` : '';
    appendMessage({
      speaker: '【猎人技能】',
      role: 'player',
      text: `猎人发动技能，开枪带走了 【${shotTarget}】${revealText}！`
    });
    recordEventToAllBots(`猎人开枪射杀了【${shotTarget}】`);
    gameLog('猎人技能', `玩家猎人开枪带走【${shotTarget}】 (${dead?.role})`);
  } else {
    const shotTarget = livingOthers[Math.floor(Math.random() * livingOthers.length)].name;
    const dead = activeGame.seats.find(s => s.name === shotTarget);
    if (dead) {
      dead.alive = false;
      dead.deathReason = `第 ${activeGame.day} 天被猎人【${hunterSeat.name}】开枪带走出局`;
    }
    const revealText = activeGame.revealOnDeath && dead ? `（真实身份：${getRoleCn(dead.role)}）` : '';
    appendMessage({
      speaker: `【猎人技能】${hunterSeat.name}`,
      role: 'bot',
      text: `猎人在出局前扣动扳机，开枪带走了 【${shotTarget}】${revealText}！`
    });
    recordEventToAllBots(`猎人【${hunterSeat.name}】开枪带走了【${shotTarget}】`);
    gameLog('猎人技能', `Bot猎人【${hunterSeat.name}】开枪带走【${shotTarget}】 (${dead?.role})`);
  }
}

// 胜负检查
function checkGameOver() {
  const living = activeGame.seats.filter(s => s.alive);
  const wolves = living.filter(s => s.role === 'werewolf');
  const goods = living.filter(s => s.role !== 'werewolf');
  const allWolves = activeGame.seats.filter(s => s.role === 'werewolf');

  gameLog('胜负核验', `存活狼人: ${wolves.length}/${allWolves.length}, 存活好人: ${goods.length}`, {
    livingWolves: wolves.map(w => w.name),
    livingGoods: goods.map(g => g.name),
    allDead: activeGame.seats.filter(s => !s.alive).map(s => `${s.name}(${s.role}, ${s.deathReason || '出局'})`)
  });

  if (wolves.length === 0) {
    activeGame.gameOver = true;
    const wolfRecap = allWolves.map(w => `• 【${w.name}】：${w.deathReason || '阵亡'}`).join('\n');
    appendMessage({
      speaker: '【胜负裁决】Game Master',
      role: 'gm',
      text: `🎉 全场所有狼人均已出局！好人阵营取得最终胜利！\n\n【狼人出局复盘详情】：\n${wolfRecap}`
    });
    gameLog('最终胜负', '好人阵营胜利 (全狼出局)');
    return true;
  }
  if (wolves.length >= goods.length) {
    activeGame.gameOver = true;
    const wolfLiving = wolves.map(w => `• 【${w.name}】(存活)`).join('\n');
    appendMessage({
      speaker: '【胜负裁决】Game Master',
      role: 'gm',
      text: `🐺 狼人存活人数(${wolves.length})已达到或超过好人存活人数(${goods.length})！狼人阵营取得最终胜利！\n\n【存活狼人名单】：\n${wolfLiving}`
    });
    gameLog('最终胜负', '狼人阵营胜利 (狼人数达到或超过好人数)');
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

  function renderGameOverChoices() {
    renderChoices([
      {
        label: '再来一局 (保留跨局记忆经验)',
        action: () => {
          openStartGameConfig();
        }
      },
      {
        label: isDebugMode ? '隐藏内心思考 (关闭调试)' : '揭晓全员内心思考 (开启调试)',
        action: () => {
          toggleDebugMode();
          renderGameOverChoices();
        }
      },
      {
        label: '返回主菜单',
        action: showMainMenu
      }
    ]);
  }
  renderGameOverChoices();
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
  updateDebugModeUI();
  const debugBtn = document.getElementById('btnToggleDebug');
  if (debugBtn) debugBtn.onclick = toggleDebugMode;
  const logBtn = document.getElementById('btnViewLog');
  if (logBtn) logBtn.onclick = openLogViewerModal;

  await detectInstalledModels();
  showMainMenu();
});

