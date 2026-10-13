import urllib.request
import json
import time

personality_grace = """# Personality: Grace

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
- 遇到危机: 从概率自证，列出放逐自己对好人阵营造成的巨大损失。"""

payload = {
    'model': 'qwen3.5:latest',
    'messages': [
        {
            'role': 'system',
            'content': f"你是狼人杀玩家【Grace】。你的 Personality 文件如下：\n{personality_grace}\n现在是开局自我介绍环节（还没有发身份）。请根据你的性格特质、说话语气和习惯小动作，做一句简短自我介绍。\n只输出 JSON: {{\"thought\": \"内心想法\", \"speech\": \"自我介绍台词\", \"gesture\": \"伴随的动作描述\"}}"
        }
    ],
    'stream': False,
    'format': 'json',
    'think': False,
    'options': {'temperature': 0.7, 'num_predict': 500}
}

req = urllib.request.Request(
    'http://localhost:11434/api/chat',
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

t0 = time.time()
with urllib.request.urlopen(req, timeout=30) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    print(f"Elapsed: {time.time()-t0:.2f}s")
    print("Content:", res['message']['content'])
