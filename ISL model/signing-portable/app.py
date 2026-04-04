#!/usr/bin/env python3
"""
Single entrypoint: serves the static frontend and a small JSON API.

Run from this folder:
  python app.py

Then open http://127.0.0.1:8080/ (or the host/port printed below).
Environment: HOST (default 127.0.0.1), PORT (default 8080), OPEN_BROWSER=1 to open the browser.
"""

from __future__ import annotations

import json
import os
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent


class AppHandler(SimpleHTTPRequestHandler):
    """Serves static files from BASE_DIR; routes /api/* to a minimal backend."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        if path == "/api" or path.startswith("/api/"):
            self._handle_api(parsed)
            return
        super().do_GET()

    def _handle_api(self, parsed):
        path = parsed.path.rstrip("/") or "/"
        if path == "/api/health":
            payload = {"status": "ok", "app": "signing-portable"}
            self._send_json(200, payload)
            return
        self.send_error(404, "API route not found")

    def _send_json(self, code: int, obj: dict) -> None:
        body = json.dumps(obj, separators=(",", ":")).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write(
            "%s - - [%s] %s\n"
            % (self.address_string(), self.log_date_time_string(), fmt % args)
        )


def main() -> None:
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8080"))
    httpd = ThreadingHTTPServer((host, port), AppHandler)
    root = f"http://{host}:{port}/"
    print("Frontend:", root)
    print("Backend: ", f"http://{host}:{port}/api/health")
    print("Press Ctrl+C to stop.")
    if os.environ.get("OPEN_BROWSER", "").strip() in ("1", "true", "yes"):
        webbrowser.open(root)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        httpd.shutdown()


if __name__ == "__main__":
    main()
