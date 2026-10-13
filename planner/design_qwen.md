# 🐺 《心机之狼》(Mind Wolves) - 游戏设计文档

## 1. 游戏概述 (Game Overview)
**《心机之狼》** 是一款基于本地大语言模型（Ollama）的单机社交推理游戏。玩家将与多个拥有独立性格、记忆和行为逻辑的AI Bot进行狼人杀对局。游戏通过HTML5静态页面呈现，核心体验在于观察AI的微表情、分析其发言逻辑，并通过自由对话和夜间投票来找出（或隐藏）狼人身份。

## 2. 系统架构与技术栈 (System Architecture)
*   **前端 (Frontend):** HTML5 + CSS3 + Vanilla JavaScript (或轻量级 Vue/React)。纯静态文件，由 Nginx/Apache 或 `python -m http.server` 托管。
*   **AI 引擎 (AI Engine):** Ollama (本地运行)。前端通过 Fetch API 直接调用 Ollama 的 REST API (`/api/chat`)。*(注：需配置 Ollama 环境变量 `OLLAMA_ORIGINS=*` 以允许浏览器跨域请求)*。
*   **数据存储 (Storage):** 
    *   **Personality 文件:** 存储在浏览器的 `localStorage` 或 `IndexedDB` 中，支持导出/导入 JSON。
    *   **Memory 文件:** 游戏运行期间保存在前端内存 (JavaScript 对象) 中，游戏结束后可序列化保存至 `localStorage` 以供跨局使用。

---

## 3. 核心系统设计 (Core Systems)

### 3.1 人格系统 (Personality System)
每个 Bot 拥有一个独立的 Personality JSON 文件，决定其基础行为模式。
**数据结构示例：**
```json
{
  "id": "p_001",
  "name": "老李",
  "archetype": "多疑的老玩家",
  "traits": ["谨慎", "喜欢抓逻辑漏洞", "偶尔阴阳怪气"],
  "speech_style": "喜欢用反问句，语速慢，经常带‘呵呵’、‘有意思’等口头禅。",
  "habitual_actions": ["摸下巴", "眼神游移", "冷笑"],
  "core_belief": "发言最多的人往往在掩饰什么。"
}
```
**管理功能：** 游戏主界面提供“人格工坊”，允许玩家创建、编辑、删除 Personality，并为每个 Bot 随机或手动分配不同的人格。

### 3.2 记忆系统 (Memory System)
这是游戏的核心。每个 Bot 维护一个动态更新的 Memory 对象。为了防止 Context 溢出，Memory 采用 **“滑动窗口 + 摘要压缩”** 机制。
**数据结构示例：**
```json
{
  "identity": "平民",
  "status": "alive",
  "suspicions": {
    "Bot_A": 0.8,  // 怀疑度 0-1
    "Player": 0.2
  },
  "key_events": [
    "Day 1: Bot_A 发言时逻辑混乱，且被 Bot_B 质疑时没有有效反驳。",
    "Day 1 Night: 我(平民)平安无事。"
  ],
  "recent_dialogue_summary": "当前白天，Bot_A 正在向 Player 施压，Player 保持沉默。"
}
```
**记忆更新机制 (Memory Summarization)：**
在每一轮白天结束或黑夜结算后，系统会触发一个后台 LLM 调用（使用小参数模型如 `llama3:8b` 以节省资源），输入当前 Memory 和最近发生的事件，输出更新并压缩后的新 Memory。

---

## 4. 游戏流程详细设计 (Detailed Game Flow)

### 4.1 准备阶段 (Setup Phase)
1.  **GM 开场白：** 界面显示 Game Master (系统) 的欢迎语，简述基本规则（狼人、村民、预言家/女巫等角色技能）。
2.  **配置对局：** 玩家选择本局人数（如 6人局：2狼，2民，1预言家，1女巫），选择自己的 Personality，并为其他 5 个 Bot 分配不同的 Personality。
3.  **发牌与初始化：** 系统在后台随机分配身份。为每个 Bot 初始化 Memory（写入其真实身份和初始 Personality 认知）。

### 4.2 白天阶段 (Day Phase) - 自由活动
白天采用**回合制 (Turn-based)**，按座位顺序（或随机）依次行动。

**Bot 行动逻辑：**
轮到 Bot 时，系统构建 Prompt 发送给 Ollama。Bot 必须返回 JSON 格式的行动指令。
*可选行动池：*
*   `[Observation]` 观察并评论某人的微表情/小动作。
*   `[Question]` 向特定玩家（Bot 或 人类）提问。
*   `[Statement]` 发表声明/辩解/带节奏。
*   `[Action]` 做一个小动作（如：叹气、喝水、摸鼻子）。
*   `[Silence]` 保持沉默，暗中观察。

**玩家行动逻辑：**
轮到玩家时，界面提供以下选项：
*   **[观察]**：查看当前场上所有 Bot 的“小动作/表情”描述（由系统根据 Bot 的 Personality 和当前局势生成）。
*   **[提问]**：输入框输入问题，并选择提问目标。目标 Bot 会根据其 Personality 和 Memory 进行回答。
*   **[发言]**：发表一段全局发言。
*   **[结束白天]**：主动提议进入黑夜（当玩家认为信息收集足够时）。

**白天结束条件 (满足其一即触发)：**
1.  玩家主动点击 [结束白天]。
2.  连续 3 个回合所有 Bot 都选择 `[Silence]` 或无意义动作。
3.  总对话/行动次数达到阈值（如 50 次）。

### 4.3 黑夜阶段 (Night Phase)
1.  **天黑请闭眼：** 界面变暗，GM 播报。
2.  **狼人请杀人：** 
    *   存活的狼人 Bot 依次被唤醒。
    *   系统构建 Prompt（包含规则、Personality、Memory、当前存活玩家列表）。
    *   狼人 Bot 思考并返回击杀目标。如果多个狼人，系统需处理“意见不一致”的情况（可设定为随机击杀、或按座位顺序第一狼人的决定、或再次投票）。
3.  **神职行动 (可选)：** 预言家查验、女巫救/毒（逻辑同狼人，由对应 Bot 决策）。
4.  **天亮请睁眼：** GM 宣布昨晚死亡情况。
5.  **结算与更新：** 死亡玩家 Memory 状态更新为 `dead`（死后只能旁观或作为幽灵发言，视规则而定），存活 Bot 触发 **Memory Summarization**。

### 4.4 游戏结束 (Game Over)
当狼人全灭或好人全灭，游戏结束。GM 公布所有 Bot 的真实身份，并展示每个 Bot 的“最终复盘思考”（基于其最终 Memory 生成），玩家可借此了解 AI 的心路历程。

---

## 5. Prompt 工程设计 (Prompt Engineering)

由于 Context 限制（通常 4k-8k），Prompt 必须高度结构化且精简。

### 5.1 Bot 思考与行动 Prompt 模板
```text
[System]
你是一个狼人杀游戏中的AI玩家。请严格遵守游戏规则。
游戏规则简述：[动态插入：如6人局，2狼2民1预1女，狼人每晚杀一人，白天投票等]。

[Your Personality]
{插入当前Bot的Personality JSON}

[Your Memory]
{插入当前Bot的Memory JSON}

[Current Situation]
今天是第 {X} 天白天。当前存活玩家：[列表]。
最近发生的3轮对话摘要：
{插入 recent_dialogue_summary}

[Task]
现在轮到你行动。请先在 <thought> 标签内进行深度思考（分析局势、结合你的性格和记忆），然后在 <action> 标签内输出你的决定。
你的决定必须是严格的 JSON 格式，包含以下字段：
{
  "action_type": "Observation" | "Question" | "Statement" | "Action" | "Silence",
  "target": "目标玩家名字，如果没有则为null",
  "content": "你说的话或做的动作描述",
  "internal_suspicion_update": {"玩家A": 0.5, "玩家B": 0.8} // 你内心对他人怀疑度的微调
}
```

### 5.2 记忆压缩 Prompt 模板 (后台静默执行)
```text
[System]
你是一个记忆管理助手。请根据提供的旧记忆和新发生的事件，更新玩家的记忆。
要求：
1. 保持 JSON 格式。
2. 压缩对话历史，只保留关键逻辑和结论，丢弃废话。
3. 根据 internal_suspicion_update 调整 suspicions 数值。
4. 总字符数严格控制在 800 字以内。

[Old Memory]
{旧 Memory JSON}

[New Events]
{本轮发生的事件和对话}

[Output]
请输出更新后的 Memory JSON：
```

---

## 6. UI/UX 设计 (UI/UX Design)

界面采用**深色沉浸式主题**，模拟夜晚和神秘氛围。

### 6.1 主界面 (Main Menu)
*   **人格工坊 (Personality Workshop)：** 列表展示已创建的人格，支持新建、编辑、删除。
*   **开始游戏 (Start Game)：** 配置人数、选择自己的人格、为 Bot 分配人格。
*   **历史记录 (History)：** 查看过往对局的复盘。

### 6.2 游戏对局界面 (Game Board)
*   **中央圆桌 (The Table)：** 显示所有玩家的头像/名字。存活为亮色，死亡为灰色带骷髅标记。当前行动回合的玩家头像有高亮呼吸灯效果。
*   **左侧：对话/事件流 (Event Log)：** 类似聊天框，按时间顺序显示 GM 播报、Bot 发言、动作描述。不同 Bot 的发言气泡颜色/样式可根据其 Personality 微调。
*   **右侧：玩家操作面板 (Player Control)：**
    *   当轮到玩家时，显示大按钮：`[观察全场]`、`[提问]`、`[发表演讲]`、`[提议入夜]`。
    *   点击 `[提问]` 时，弹出模态框：选择目标 -> 输入问题 -> 发送。
    *   点击 `[观察全场]` 时，展开手风琴列表，显示每个 Bot 当前的微表情/小动作（如：“老李正在不耐烦地敲击桌面”）。
*   **底部：状态栏 (Status Bar)：** 显示当前天数、剩余对话次数（如 42/50）、玩家身份（仅自己可见）。

---

## 7. 边界情况与异常处理 (Edge Cases & Error Handling)

1.  **LLM 输出格式错误 (JSON Parse Error)：**
    *   *对策：* 在 Prompt 中强调 JSON 格式。如果前端解析失败，使用正则表达式提取 JSON 部分；若仍失败，则让 Bot 执行默认的 `[Silence]` 动作，并在 UI 提示“该玩家似乎陷入了沉思”。
2.  **LLM 幻觉 (Hallucination)：**
    *   *对策：* 在 Prompt 中明确限制 Bot 只能基于 [Your Memory] 和 [Current Situation] 行动，禁止捏造已死亡玩家发言或虚构不存在的角色。
3.  **Ollama 响应超时/断开：**
    *   *对策：* 前端设置 Fetch 超时时间（如 60 秒）。超时则显示“网络波动，该玩家正在努力思考...”，并提供 `[重试]` 按钮。
4.  **死循环 (Bot 互相提问不结束)：**
    *   *对策：* 严格执行“对话次数阈值”（如 50 次）和“连续沉默阈值”强制进入黑夜，防止白天无限循环。

## 8. 后续扩展方向 (Future Expansions)
*   **语音合成 (TTS) 集成：** 接入本地 TTS（如 Edge-TTS 或 VITS），让不同 Personality 的 Bot 拥有不同的音色和语调。
*   **微表情立绘：** 为 Bot 添加 Live2D 或简单的 SVG 动画，根据 Bot 返回的 `action` 改变表情。
*   **更复杂的板子：** 加入守卫、猎人、白痴等角色，丰富夜间逻辑和白天技能。