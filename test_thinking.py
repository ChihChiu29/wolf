import urllib.request
import json

# Test 1: with think: false in options or body
# Test 2: with larger num_predict
# Test 3: check if thinking can be turned off or handled

for think_opt in [False, True, None]:
    payload = {
        'model': 'qwen3.5:latest',
        'messages': [
            {
                'role': 'system',
                'content': 'You are werewolf player Grace. Output JSON: {"thought": "my internal thought", "speech": "my speech", "gesture": "my action"}'
            }
        ],
        'stream': False,
        'format': 'json',
        'options': {'temperature': 0.7, 'num_predict': 1000}
    }
    if think_opt is not None:
        payload['think'] = think_opt

    req = urllib.request.Request(
        'http://localhost:11434/api/chat',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            msg = res.get('message', {})
            print(f"think_opt={think_opt}:")
            print(f"  thinking length: {len(msg.get('thinking', ''))}")
            print(f"  content: {msg.get('content', '')}")
            print(f"  done_reason: {res.get('done_reason')}")
    except Exception as e:
        print(f"think_opt={think_opt} error: {e}")
