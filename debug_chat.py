import urllib.request
import json

payload = {
    'model': 'qwen3.5:latest',
    'messages': [
        {
            'role': 'system',
            'content': 'You are werewolf player Grace. Output JSON: {"thought": "thinking...", "speech": "intro speech", "gesture": "action"}'
        }
    ],
    'stream': False,
    'format': 'json',
    'options': {'temperature': 0.7, 'num_predict': 500}
}

req = urllib.request.Request(
    'http://localhost:11434/api/chat',
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print("FULL RESPONSE:")
        print(json.dumps(res, indent=2, ensure_ascii=False))
except Exception as e:
    print("ERROR:", e)
