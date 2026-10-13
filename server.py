import sys
import json
import os
from http.server import SimpleHTTPRequestHandler, HTTPServer

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'game.log')

class WolfRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_POST(self):
        if self.path == '/api/log':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8', errors='replace')
            try:
                data = json.loads(body)
                time_str = data.get('time', '')
                type_str = data.get('type', 'INFO')
                msg = data.get('msg', '')
                details = data.get('data')
                detail_str = f" | {json.dumps(details, ensure_ascii=False)}" if details is not None else ""
                log_line = f"[{time_str}] [{type_str}] {msg}{detail_str}\n"
            except Exception:
                log_line = f"{body}\n"

            try:
                with open(LOG_FILE, 'a', encoding='utf-8') as f:
                    f.write(log_line)
            except Exception as e:
                print(f"Error writing to log: {e}", file=sys.stderr)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
        else:
            self.send_error(404, "Not Found")

def run(port=8000):
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, WolfRequestHandler)
    print(f"[WolfServer] Running on http://localhost:{port} (Log file: {LOG_FILE})")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run(port)
