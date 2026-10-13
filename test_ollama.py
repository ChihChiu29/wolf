import urllib.request
import json
import time

models_to_test = ['qwen3.5:latest', 'llama3.1:8b']

for model in models_to_test:
    print(f"Testing model: {model}...")
    req_data = {
        'model': model,
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
        data=json.dumps(req_data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            raw = data.get('message', {}).get('content', '')
            print(f"Time taken: {time.time()-t0:.2f}s")
            print(f"Raw content: {raw}")
            parsed = json.loads(raw)
            print(f"Parsed successfully: {parsed}")
    except Exception as e:
        print(f"Failed on {model}: {e}")
