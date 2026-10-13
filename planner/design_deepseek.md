# 单机模拟多人“狼人杀”游戏设计文档

## 1. 项目目标

做一个纯前端、单机运行的“模拟多人狼人杀”。  
玩家只操作自己，其他座位由本地 Ollama LLM 控制。每个 bot 有独立 personality 和 memory，行为、发言、投票、表情、小动作都受 personality 与当前局势影响。

核心目标：

- HTML5 前端，静态内容服务器即可运行。
- bot 全部由本地 Ollama 驱动。
- 玩家可选择人数、角色配置、每个 bot 的 personality。
- 支持创建、编辑、删除、导入导出 Personality 文件。
- 每个 bot 有内存中的 Memory 文件，记录本局信息，并可跨连续多局保留经验。
- 白天自由活动，夜晚狼人投票刀人，Game Master 控制流程。
- 上下文控制在几 k token 内，超长时自动 summarize。

> 注意：如果严格使用静态服务器，浏览器直接请求 `http://localhost:11434` 调 Ollama，需要设置 `OLLAMA_ORIGINS` 允许你的页面来源。若不想配置 CORS，可以额外跑一个极小的本地代理；但核心游戏仍是静态前端。

---

## 2. 核心概念

| 概念 | 说明 |
|---|---|
| GameMaster | 游戏控制器，管理状态、回合、规则、投票、胜负、Prompt 构建。 |
| Seat | 座位，可能是玩家或 bot。 |
| Bot | 由 Ollama 控制的 AI 玩家，有 personality 和 memory。 |
| Personality | 性格文件，控制语气、话量、攻击性、习惯动作、提问频率等。 |
| Memory | 内存中的虚拟文件，记录 bot 本局身份、观察、怀疑、计划、历史事件。 |
| Public Event | 所有人都能看到的事件：发言、表情、动作、投票结果、死亡公告。 |
| Private Event | 只有特定 bot 能看到：狼人队友、预言家查验、女巫用药、狼队投票理由。 |
| Day Phase | 自由活动阶段，bot 和玩家轮流行动、提问、观察、发言。 |
| Night Phase | 夜间行动阶段，预言家查验、狼人刀人、女巫用药、猎人被动。 |
| Day Vote | 白天放逐投票。原需求未明确，但如果没有白天放逐，好人无法主动消灭狼人，因此建议默认开启。 |

---

## 3. 角色与规则

### 3.1 推荐角色配置

| 人数 | 狼人 | 预言家 | 女巫 | 猎人 | 村民 |
|---|---:|---:|---:|---:|---:|
| 6 | 2 | 1 | 1 | 0 | 2 |
| 8 | 2 | 1 | 1 | 1 | 3 |
| 9 | 3 | 1 | 1 | 1 | 3 |
| 10 | 3 | 1 | 1 | 1 | 4 |

### 3.2 角色能力

- 狼人：夜晚依次投票选择击杀目标，知道队友。可以撒谎、伪装、带节奏。
- 村民：无夜间能力，依靠白天发言、观察、投票找狼。
- 预言家：每晚查验一人，得知“好人/狼人”。
- 女巫：一瓶解药、一瓶毒药，各一次。夜晚知道谁被狼人击杀，可选择救或毒。
- 猎人：被狼人击杀或被放逐时，可开枪带走一人；被女巫毒死则不能开枪。

### 3.3 胜负条件

推荐使用“屠边”：

- 狼人胜利：所有村民死亡，或所有神职死亡。
- 好人胜利：所有狼人死亡。

如果简化，也可用：

- 狼人存活数 >= 好人存活数，狼人胜。
- 狼人全死，好人胜。

### 3.4 开局 GM 公告模板

> 本局为 8 人狼人杀。角色包括：狼人 2 名、预言家 1 名、女巫 1 名、猎人 1 名、村民 3 名。  
> 狼人夜晚可击杀一人；预言家每晚可查验一人；女巫有一瓶解药和一瓶毒药；猎人死亡时可开枪。  
> 白天自由讨论，随后投票放逐一人。夜晚狼人行动。好人消灭所有狼人获胜，狼人屠边获胜。

---

## 4. 游戏主循环

### 4.1 Setup 阶段

1. 玩家进入 Lobby。
2. 选择人数：6~10。
3. 选择角色预设。
4. 为每个 bot 分配 Personality 文件。
5. 玩家输入自己的名字，选择座位。
6. GameMaster 洗牌分配角色。
7. 初始化每个 bot 的 Memory。
8. GM 公告角色说明。
9. 进入 Night 0 或直接进入 Day 1。

### 4.2 Night 0 / 第一夜

建议保留第一夜，用于：

- 狼人互相认识。
- 预言家获得第一次查验。
- 女巫知道解药毒药状态。
- 玩家如果是狼人，看到狼队友。

第一夜不杀人，或按配置杀人。为了节奏，推荐第一夜只处理信息，不杀人，然后进入第一天。

### 4.3 Day Phase：白天自由活动

白天采用“轮转行动制”。

每轮按座位顺序，所有存活玩家依次行动一次。  
每个 bot 被轮到时会：

1. 读取自己的 Prompt Context。
2. 内部思考。
3. 输出一个公开行动。
4. GM 校验并广播。
5. 更新所有 bot 的 public memory。
6. 更新该 bot 的 private memory。

玩家被轮到时，可以选择：

- 观察某 bot：GM 让该 bot 生成表情、小动作、语气变化。
- 向某 bot 提问：该 bot 立即回答。
- 公开发言：输入文字。
- 做出表情/动作：选择或输入。
- 指控/辩护/跳身份。
- Pass。
- 结束白天（若允许）。

白天结束条件：

- 连续一整轮所有人都 Pass。
- 没有新的提问，且没有 bot 或玩家再主动发言。
- 公开事件达到上限，例如 50 条对话。
- 玩家点击“进入黑夜”。
- GM 判断讨论已经充分。

满足任一条件后，GM 公告：

> 讨论时间结束，进入投票/黑夜。

### 4.4 Day Vote：白天放逐投票

虽然不是原始需求明确要求，但强烈建议加入。

流程：

1. GM 公告进入放逐投票。
2. 每个存活玩家依次投票。
3. bot 根据 memory、personality、当前局势投票。
4. 玩家选择投票目标。
5. 票高者被放逐。
6. 平票则重新投票一次，或随机放逐，或无人放逐。
7. 被放逐者发表遗言。
8. 猎人若被放逐可开枪。
9. 检查胜负。

### 4.5 Night Phase：黑夜

夜晚行动顺序推荐：

1. 预言家查验。
2. 狼人依次投票刀人。
3. 女巫决定救/毒。
4. 猎人结算。
5. GM 计算死亡。
6. 检查胜负。
7. 天亮公告。

狼人投票流程：

- 存活狼人按顺序行动。
- 每只狼输出：目标、理由、内心思考、memory patch。
- 第一个狼投票后，GM 将“狼 A 投了 X，理由是……”写入后续狼人的私有 memory。
- 后续狼可以看到前面狼的投票和理由，再决定自己的票。
- 票数最高者被刀。
- 平票时随机，或优先刀神职，或重新投票。

### 4.6 天亮公告

GM 公告：

- 昨晚死亡名单。
- 是否有遗言。
- 当前存活人数。
- 进入新一天。

死亡玩家不再行动，但可以根据配置保留“遗言”或“观战”。

---

## 5. Bot 行动设计

### 5.1 行动类型

| 类型 | 说明 |
|---|---|
| speak | 公开发言 |
| ask | 向某人提问 |
| answer | 回答 pending 问题 |
| observe | 观察某人 |
| gesture | 表情、小动作 |
| accuse | 指控 |
| defend | 辩护 |
| claim | 跳身份 |
| pass | 过 |
| vote | 白天放逐投票 |
| night_action | 夜间行动 |
| last_words | 遗言 |

### 5.2 Bot 输出格式

Bot 必须输出 JSON，便于 GM 解析。

```json
{
  "thought": "隐藏思考：P3 刚才回避我的问题，可能是狼。",
  "public_action": {
    "type": "ask",
    "target": "P3",
    "content": "你刚才为什么一直看 P5？",
    "emotion": "试探",
    "gesture": "眯眼"
  },
  "memory_patch": {
    "beliefs": [
      {
        "target": "P3",
        "suspicion": 72,
        "reason": "回避问题，语气紧张"
      }
    ],
    "plan": "继续施压 P3，观察 P5 反应"
  }
}
```

### 5.3 思考与公开分离

- `thought` 只进入该 bot 的私有 memory，不公开。
- `public_action` 进入公共事件流。
- `memory_patch` 用于更新该 bot 的 memory，减少额外 LLM 调用。

### 5.4 知识边界

每个 bot 只能看到：

- 公共事件。
- 自己的角色。
- 狼人队友。
- 自己的夜间结果。
- 自己的私有 memory。
- 自己的 personality。

不能看到：

- 其他 bot 的真实角色。
- 其他 bot 的私有 memory。
- GM 的完整状态。
- 自己不该知道的夜间信息。

GM 要做“知识防火墙”。如果 bot 输出中引用了不该知道的信息，GM 可以：

1. 要求重新生成。
2. 替换为安全发言。
3. 降级为 Pass。

---

## 6. Prompt / Context 构建

### 6.1 上下文预算

目标模型：7B~8B 本地模型，上下文 4k~8k。  
建议每轮 Prompt 控制在 2.5k~3.5k token。

| 部分 | 预算 |
|---|---:|
| 系统规则 | 250 |
| Personality | 300 |
| Memory 摘要 | 800 |
| 最近公共事件 | 1200 |
| 当前状态 | 300 |
| 任务说明 | 200 |
| 输出预留 | 250 |
| 合计 | 约 3300 |

### 6.2 白天行动 Prompt 模板

```text
你是 {name}，正在玩狼人杀。

【规则摘要】
{简短规则}

【你的性格】
{personality_json 或自然语言描述}

【你的秘密身份】
{role} {teammates_if_wolf}

【你的记忆】
{memory_summary}
最近公共事件：
{recent_events}

【当前状态】
第 {day} 天白天，存活：{alive_list}，死亡：{dead_list}

【任务】
现在轮到你行动。请根据性格、记忆和当前局势，选择一个行动。
可选：speak, ask, observe, gesture, accuse, defend, claim, pass。
不要直接说出你不该知道的信息。
只输出 JSON：
{
  "thought": "...",
  "public_action": {
    "type": "...",
    "target": "...",
    "content": "...",
    "emotion": "...",
    "gesture": "..."
  },
  "memory_patch": {
    "beliefs": [],
    "plan": "..."
  }
}
```

### 6.3 夜晚狼人 Prompt

```text
你是狼人 {name}。你的队友是 {teammates}。
现在是第 {night} 夜。存活玩家：{alive_list}。
你的记忆：{memory_summary}
前面狼人的投票：
{previous_wolf_votes}

请选择今晚要击杀的目标，并给出理由。
只输出 JSON：
{
  "thought": "...",
  "vote": {
    "target": "P4",
    "reason": "..."
  },
  "memory_patch": {}
}
```

### 6.4 观察 Prompt

当玩家观察某 bot 时，GM 调用该 bot：

```text
玩家正在观察你。根据你的性格、当前情绪和隐藏身份，生成一个可观察的表情、小动作或语气变化。
不要直接说出身份或夜晚秘密。
只输出 JSON：
{
  "observable": "你看到他手指轻轻敲桌，眼神避开 P5。",
  "subtext": "他似乎在紧张。"
}
```

### 6.5 总结 Prompt

```text
请把以下旧事件压缩成要点，保留：
死亡、身份宣称、查验结果、投票、强烈指控、关系变化。
删除寒暄和重复内容。
输出 JSON：
{
  "summary": "...",
  "key_facts": ["..."],
  "beliefs": [{"target": "P3", "suspicion": 70, "reason": "..."}]
}
```

### 6.6 JSON 修复

如果模型输出不是合法 JSON：

1. 第一次：追加“你上次输出不是合法 JSON，请只输出 JSON”。
2. 第二次：GM 用规则解析，提取最接近的字段。
3. 第三次：降级为 Pass 或随机合法行动。

---

## 7. Memory 设计

### 7.1 Memory 分层

每个 bot 有两个大层：

1. **Session Memory / 跨局记忆**
   - 跨多个连续游戏保留。
   - 记录玩家风格、其他 bot 行为模式、有效策略。
   - 不保留本局秘密身份，或按配置匿名化。

2. **Game Memory / 本局记忆**
   - 只在本局有效。
   - 记录当前身份、队友、查验、怀疑、计划、投票。
   - 游戏结束后总结进 Session Memory，然后清空。

### 7.2 Game Memory Schema

```json
{
  "botId": "B2",
  "personalityId": "sly_old_fox",
  "gameId": "g_001",
  "identity": {
    "role": "werewolf",
    "teammates": ["B4"]
  },
  "summary": "第一天 P3 跳预言家，P5 质疑他。",
  "publicEvents": [
    {
      "day": 1,
      "type": "speak",
      "actor": "P3",
      "content": "我是预言家，昨晚验了 P5 是狼。"
    }
  ],
  "privateNotes": [
    {
      "night": 1,
      "type": "wolf_vote",
      "target": "P3",
      "reason": "他可能是真预言家"
    }
  ],
  "beliefs": {
    "P1": {"suspicion": 30, "trust": 60, "roleGuess": "villager"},
    "P3": {"suspicion": 80, "trust": 10, "roleGuess": "seer"},
    "P5": {"suspicion": 50, "trust": 40, "roleGuess": "unknown"}
  },
  "plan": "白天假装站边 P5，晚上刀 P3。",
  "crossGame": [
    "玩家喜欢先观察再提问。",
    "B3 在上一局经常撒谎。"
  ]
}
```

### 7.3 Memory 更新时机

- Bot 每次行动后，GM 合并 `memory_patch`。
- 每个公共事件广播后，追加到 publicEvents。
- 夜间行动后，追加到 privateNotes。
- 公共事件超过 20 条，或 token 超预算，触发 summarize。
- 游戏结束时，生成跨局总结。

### 7.4 总结策略

- 最近 10~15 条事件保留原文。
- 更早事件压缩成 summary。
- 关键事实永不删除：
  - 死亡。
  - 跳身份。
  - 查验结果。
  - 投票。
  - 强烈指控。
  - 狼队友信息。
- 寒暄、重复语气、无关表情可删除。

### 7.5 跨局保留

游戏结束时，GM 为每个 bot 生成跨局总结：

```json
{
  "playerStyle": "玩家喜欢先问表情，再问逻辑。",
  "botPatterns": {
    "B3": "当狼时话变少。",
    "B5": "喜欢跟风投票。"
  },
  "effectiveStrategy": "先跳弱身份，后期带节奏。"
}
```

下一局开始时，这段内容作为“历史经验”注入 Prompt。

---

## 8. Personality 设计

### 8.1 Personality Schema

```json
{
  "id": "sly_old_fox",
  "name": "老狐狸",
  "avatar": "fox.png",
  "tone": "慢条斯理、阴阳怪气",
  "verbosity": 0.7,
  "aggressiveness": 0.4,
  "curiosity": 0.8,
  "questionFrequency": 0.6,
  "emotionality": 0.3,
  "riskTaking": 0.5,
  "lieStyle": "半真半假，喜欢反问",
  "quirks": ["说话前摸胡子", "喜欢眯眼", "常用“有意思”"],
  "catchphrases": ["有意思", "你确定？", "我不急"],
  "bodyLanguage": ["敲桌子", "靠回椅背", "摸下巴"],
  "taboos": ["讨厌被叫老东西"],
  "rolePreference": {
    "werewolf": 0.7,
    "seer": 0.5,
    "villager": 0.3
  }
}
```

### 8.2 Personality 与行为映射

| 字段 | 影响 |
|---|---|
| verbosity | 发言长度 |
| aggressiveness | 指控频率、投票攻击性 |
| curiosity | 提问频率 |
| emotionality | 表情、语气波动 |
| riskTaking | 是否跳身份、是否带节奏 |
| lieStyle | 狼人时撒谎方式 |
| quirks | 小动作、口头禅 |
| bodyLanguage | 观察时返回的动作 |

### 8.3 Personality 管理

- 默认文件放在 `/personalities/*.json`。
- 用户创建的 personality 存 IndexedDB / localStorage，作为“虚拟文件”。
- 支持：
  - 新建。
  - 删除。
  - 复制。
  - 导入 JSON。
  - 导出 JSON。
  - 预览 Prompt 效果。
- 如果未来需要真实文件系统，可用 File System Access API 或加一个本地小后端。

---

## 9. GameMaster 设计

### 9.1 状态机

```text
LOBBY
 -> SETUP
 -> ROLE_ASSIGN
 -> NIGHT_0
 -> DAY_FREE
 -> DAY_VOTE
 -> NIGHT
 -> RESOLVE
 -> CHECK_WIN
 -> GAME_OVER
```

### 9.2 职责

- 初始化角色。
- 维护座位、存活状态、公开事件、私有事件。
- 控制回合顺序。
- 构建每个 bot 的 Prompt。
- 调用 Ollama。
- 解析 JSON。
- 校验行动合法性。
- 更新 Memory。
- 结算夜晚。
- 统计投票。
- 判断胜负。
- 更新 UI。

### 9.3 投票统计

- 白天放逐：所有存活玩家投票。
- 夜晚狼人：所有存活狼人投票。
- 平票：
  - 第一次平票：重新投票。
  - 第二次平票：无人出局，或随机。
  - 夜晚平票：随机刀，或优先刀神职。

### 9.4 并发与超时

- Ollama 调用建议串行，或最多 2 并发。
- 每个 bot 请求超时 60 秒。
- 超时降级：
  - 白天：Pass。
  - 夜晚：随机合法目标。
- 使用队列避免同时打爆本地模型。

### 9.5 防作弊与知识过滤

- Bot Prompt 只包含它该知道的信息。
- 公共事件对所有 bot 可见。
- 私有事件只注入对应 bot。
- 如果 bot 输出包含不该知道的信息，GM 过滤或重试。
- 玩家界面默认不显示 bot 私有 memory；开发者模式可看。

---

## 10. UI / UX 设计

### 10.1 页面

1. Home / Lobby
   - 人数选择。
   - 角色预设。
   - 座位分配。
   - Personality 分配。
   - 开始游戏。

2. Game Table
   - 圆桌或座位列表。
   - 头像、名字、存活/死亡。
   - 白天/黑夜指示。
   - 公共事件流。
   - 玩家操作面板。
   - 角色卡。
   - 笔记区。
   - 结束白天按钮。

3. Personality Manager
   - 列表。
   - 编辑表单。
   - 删除/复制/导入/导出。
   - 预览。

4. Memory Inspector
   - 开发者模式。
   - 查看每个 bot 的 memory、beliefs、最近 Prompt。
   - 可手动清空跨局记忆。

5. Settings
   - Ollama 地址。
   - 模型名。
   - 温度。
   - 最大事件数。
   - 是否开启白天放逐。
   - 是否显示 debug。

### 10.2 玩家操作

轮到玩家时：

- 观察：选择目标，GM 返回可观察行为。
- 提问：选择目标，输入问题，bot 立即回答。
- 发言：输入文字。
- 表情/动作：选择或输入。
- 指控/辩护/跳身份。
- Pass。
- 结束白天。

### 10.3 公共事件流示例

```text
【第1天】
B2（老狐狸）眯着眼说：“P3，你刚才为什么一直看P5？”
P3（热血青年）拍桌：“我只是在思考！”
玩家观察 B4：你看到 B4 轻轻笑了一下，手指敲了两下桌子。
B4（沉默智者）说：“有意思。”
...
【系统】讨论达到 50 条，进入黑夜。
```

---

## 11. 技术架构

### 11.1 总体架构

```text
Browser
  ├─ UI Layer
  ├─ GameMaster
  ├─ RuleEngine
  ├─ PromptBuilder
  ├─ MemoryStore
  ├─ PersonalityStore
  └─ OllamaClient
        ↓ fetch
Ollama http://localhost:11434/api/chat
```

### 11.2 Ollama 调用

```js
async function chat(model, messages, options = {}) {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p ?? 0.9,
        num_predict: options.num_predict ?? 300
      },
      format: "json"
    })
  });
  return await res.json();
}
```

CORS 配置：

```bash
export OLLAMA_ORIGINS=http://localhost:8000
ollama serve
```

### 11.3 存储

| 数据 | 存储 |
|---|---|
| Personality | IndexedDB / localStorage，可导入导出 |
| 设置 | localStorage |
| 本局 GameState | 内存 |
| Game Memory | 内存 |
| Session Memory | 内存 + 可选导出 |
| 日志 | IndexedDB，可选 |

### 11.4 模块划分

- `GameMaster`：主循环、状态机。
- `RuleEngine`：角色、胜负、投票、夜晚结算。
- `PromptBuilder`：构建各种 Prompt。
- `OllamaClient`：调用本地模型。
- `MemoryStore`：读写、总结、跨局合并。
- `PersonalityStore`：CRUD。
- `UI`：渲染、输入、动画。
- `EventBus`：公共事件分发。

### 11.5 主循环伪代码

```js
async function runGame() {
  await setup();
  await nightZero();
  while (!gameOver) {
    await dayFree();
    await dayVote();
    await night();
    await resolveNight();
    checkWin();
  }
  await gameOverSummary();
}

async function dayFree() {
  let events = 0;
  let consecutivePasses = 0;
  while (events < MAX_EVENTS && consecutivePasses < aliveCount) {
    for (const seat of turnOrder) {
      if (!seat.alive) continue;
      const action = seat.isPlayer
        ? await ui.waitPlayerAction()
        : await botAct(seat);
      await applyAction(seat, action);
      events++;
      consecutivePasses = action.type === "pass" ? consecutivePasses + 1 : 0;
      if (events >= MAX_EVENTS) break;
    }
  }
  await announce("讨论结束，进入投票/黑夜。");
}
```

---

## 12. 关键数据 Schema

### 12.1 GameState

```json
{
  "gameId": "g_001",
  "day": 1,
  "phase": "DAY_FREE",
  "seats": [
    {
      "id": "P1",
      "name": "玩家",
      "isPlayer": true,
      "alive": true,
      "role": "seer",
      "personalityId": null
    },
    {
      "id": "B2",
      "name": "老狐狸",
      "isPlayer": false,
      "alive": true,
      "role": "werewolf",
      "personalityId": "sly_old_fox",
      "model": "qwen2.5:7b"
    }
  ],
  "publicEvents": [],
  "privateEvents": {},
  "votes": {},
  "nightActions": {}
}
```

### 12.2 PublicEvent

```json
{
  "id": "e_001",
  "day": 1,
  "phase": "DAY_FREE",
  "actor": "B2",
  "type": "ask",
  "target": "P3",
  "content": "你刚才为什么一直看 P5？",
  "emotion": "试探",
  "gesture": "眯眼",
  "timestamp": 1710000000
}
```

### 12.3 Action

```json
{
  "type": "ask",
  "target": "P3",
  "content": "...",
  "emotion": "...",
  "gesture": "..."
}
```

---

## 13. 性能与上下文管理

### 13.1 模型建议

- 白天发言：7B~8B，temperature 0.7。
- 夜晚投票：7B~8B，temperature 0.4。
- 总结：同模型，temperature 0.2。
- 每 bot 可独立配置模型，但建议统一，避免显存爆炸。

### 13.2 摘要触发

- publicEvents > 20。
- 估算 token > 上下文 70%。
- 每过一天。
- 游戏结束。

### 13.3 并发

- Ollama 串行队列。
- 同一时间只允许 1~2 个请求。
- UI 显示“B2 正在思考……”。

### 13.4 缓存

- Personality 描述可缓存。
- 系统规则可缓存。
- 每局角色说明可缓存。
- 最近事件保留原文，旧事件摘要。

---

## 14. 安全与鲁棒性

| 风险 | 处理 |
|---|---|
| JSON 解析失败 | 重试、修复、降级 Pass |
| 模型超时 | 降级随机合法行动 |
| 目标已死亡 | 改为随机存活目标或 Pass |
| 泄露秘密 | 知识过滤，重试或替换 |
| 上下文过长 | 自动 summarize |
| 模型幻觉 | GM 校验行动合法性 |
| 玩家看到不该看 | UI 权限控制 |
| CORS 失败 | 配置 OLLAMA_ORIGINS 或本地代理 |

---

## 15. 测试计划

### 15.1 单元测试

- 角色分配。
- 投票统计。
- 胜负判断。
- 夜晚结算。
- Memory 合并。
- Prompt 构建。

### 15.2 集成测试

- Mock LLM 返回固定 JSON。
- 6 人局完整跑通。
- 8 人局带神职。
- 跨两局 memory 保留。

### 15.3 压力测试

- 10 bot，50 条公共事件。
- 上下文不超预算。
- 请求队列不阻塞。

### 15.4 Prompt 回归

- 固定局势下，检查 bot 是否泄露秘密。
- 检查狼人是否知道队友。
- 检查村民是否不知道夜晚信息。

---

## 16. MVP 里程碑

### Phase 1：基础框架

- 静态页面。
- Personality CRUD。
- Ollama 调用。
- Lobby 和座位分配。

### Phase 2：最小可玩

- 6 人局：2 狼 4 民。
- 白天自由活动。
- 夜晚狼人刀人。
- 白天放逐投票。
- 胜负判断。

### Phase 3：神职与观察

- 预言家、女巫、猎人。
- 玩家观察 bot 表情/小动作。
- 提问与回答。

### Phase 4：Memory

- Game Memory。
- 自动 summarize。
- 跨局 Session Memory。
- Memory Inspector。

### Phase 5：打磨

- Personality 影响行为。
- 动画、音效、头像。
- 导出日志。
- 调试工具。

---

## 17. 未来扩展

- 更多角色：守卫、白狼王、丘比特、盗贼。
- 语音 TTS / STT。
- 多模型混用。
- 玩家自定义规则。
- 对局回放。
- 战绩统计。
- 局域网多人。
- 真实文件系统 Personality 管理。
- 更复杂的狼队私聊。
- 情绪系统与关系图。

---

## 18. 总结

这个游戏的核心不是“让 LLM 自由聊天”，而是：

1. GameMaster 严格控制信息边界。
2. Prompt 只给 bot 该知道的内容。
3. Memory 分层，本局记忆与跨局记忆分离。
4. Personality 决定行为风格。
5. Context 预算驱动摘要，保证几 k token 内运行。
6. 白天自由活动 + 夜晚狼人投票 + 白天放逐，形成完整狼人杀循环。

这样可以在纯静态 HTML5 页面中，用本地 Ollama 跑出一个有性格、有记忆、有欺骗、有观察、可连续多局游玩的单机模拟多人狼人杀。