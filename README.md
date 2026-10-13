# 🐺 单机模拟多人“狼人杀” (Local LLM Werewolf)

一个纯 HTML5 + Vanilla JS 构建的单机模拟多人“狼人杀”游戏，严格依据 [`planner/design_sketch.md`](file:///R:/git/wolf/planner/design_sketch.md) 与 [`planner/initial_design_template.md`](file:///R:/git/wolf/planner/initial_design_template.md) 规范实现。

**零 Node 依赖 · 零打包构建 · 对话框选择界面 · 静态服务器即开即玩！**

---

## 🌟 核心特色与需求对齐

1. **对话框选择的界面**：以对话框呈现剧情事件流与台词，底部提供清晰的编号选项按钮 `[1]`、`[2]`、`[3]`、`[4]`，纯粹专注对话与社交推理。
2. **First Name 命名的 Markdown 性格文件**：
   - 存放于 [`personalities/`](file:///R:/git/wolf/personalities/) 目录下的 `.md` 文件（如 `Alice.md`、`Bob.md`、`Charlie.md`、`David.md` 等）；
   - 文件内容包含话量、语气、习惯小动作与表情、社交与游戏风格等；
   - 支持在游戏菜单中生成新 Personality 文件（支持输入名字由本地 AI 自动生成）、删除已有 Personality 文件，或导入本地 `.md` 文件。
3. **开局选人与配置**：玩家可选择 6 人局 / 8 人局，为各个 Bot 席位指定不同的 Personality Markdown 文件。
4. **游戏完整流程**：
   - **Game Master 阐明规则与角色**：开场简述配置、阵营目标与规则；
   - **步骤 1：自我介绍破冰**：每位玩家与 Bot 按照座位顺序轮流发言自我介绍（Bot 基于 Personality 文件输出贴合性格的台词与习惯动作）；
   - **步骤 2：发放秘密身份**：系统分配身份，仅向人类玩家明示自身身份，Bot 身份私密保留于内存中；
   - **步骤 3：白天自由活动**：存活者按顺序轮流行动：
     - **Bot 行动**：先思考 (CoT: thought)，选择做小动作、公开发言、向他人提问（被提问者当场作答）；
     - **玩家行动**：可选择【👁️ 观察其他 Bot 的行为】（动态展现 Bot 当下的微表情与动作，不消耗发言权）、【向某个 Bot 提问】、【公开发言】、【跳过】或【提议进入黑夜】；
     - 提问结束或对话达到 50 次后结束自由活动；
   - **白天放逐公投**：存活者依次投票，票高者放逐出局，猎人可开枪；
   - **步骤 4：黑夜阶段**：存活狼人依次顺位投票（基于 Personality、Memory 与前序队友意向），神职行动；
   - **步骤 5：早晨宣布结果**：GM 宣布昨夜死者，检查胜负，循环直至分出胜负。
5. **In-Memory 内存记忆系统**：
   - 记忆文件存在于浏览器 JavaScript 运行时内存中（`window.__WOLF_MEMORY_POOL__`）；
   - 每次对话、观察、提问、投票与出局均实时更新至各 Bot 记忆；
   - 自动适度 Summarize，防止 Prompt Context 超过模型窗口；
   - 游戏结束后选择“再来一局”，可跨越连续多局保留历史印象与经验；刷新或关闭标签页时内存自动释放。
6. **本地 Ollama 直连**：
   - 前端 JavaScript 经由本地 CORS 原生直连 `http://localhost:11434`；
   - 支持动态自动探测本地已安装的模型（如 `qwen3.5:latest`、`llama3.1:8b` 等）；
   - 采用严格并发度为 1 的 Promise 串行任务队列，保护本地 GPU 显存。

---

## 🚀 启动与游玩说明

### 1. 确保本地 Ollama 正在运行
```bash
ollama serve
```

### 2. 在项目根目录启动静态服务器
使用 Python 内置命令启动：
```bash
python -m http.server 8000
```

### 3. 打开浏览器游玩
在浏览器中访问：**[http://localhost:8000](http://localhost:8000)**

---

## 📁 项目目录结构

```text
wolf/
  ├── index.html                # 纯静态对话框选择主界面
  ├── style.css                 # 沉浸式对话框与选项按钮样式
  ├── app.js                    # 游戏逻辑引擎、Ollama 直连控制器、内存记忆系统
  ├── personalities/            # 独立 Markdown 性格文件目录
  │   ├── Alice.md              # 偏少话量、轻柔温和、食指点下巴
  │   ├── Bob.md                # 豪爽大嗓门、拍桌子、情绪外露
  │   ├── Charlie.md            # 慢条斯理、反问试探、老狐狸
  │   ├── David.md              # 严谨求证、推眼镜做记录、自封侦探
  │   ├── Elena.md              # 严肃冷峻、言简意赅、抱胸观察
  │   ├── Frank.md              # 随和老好人、点头擦汗、容易被说服
  │   └── Grace.md              # 知性理性、平叠双手、排除法分析
  ├── planner/
  │   ├── design_sketch.md      # 原始核心诉求
  │   ├── initial_design_template.md # 初始设计模板
  │   └── design_gemini.md      # 最新对齐设计蓝图
  └── README.md                 # 说明文档
```
