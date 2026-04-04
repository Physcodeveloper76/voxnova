import os
import signal
import subprocess
import sys
import time
import urllib.request
import webbrowser
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "VOX-main"
FRONTEND_DIR = ROOT / "frontend"
FRONTEND_URL = "http://127.0.0.1:8080"


def wait_for_url(url: str, timeout_seconds: int = 90) -> bool:
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2):
                return True
        except Exception:
            time.sleep(1)
    return False


def resolve_npm_command() -> str:
    candidates = ["npm.cmd", "npm", "C:\\Program Files\\nodejs\\npm.cmd"]
    for cmd in candidates:
        resolved = shutil.which(cmd) if "\\" not in cmd else (cmd if Path(cmd).exists() else None)
        if resolved:
            return resolved
    raise FileNotFoundError(
        "npm not found. Install Node.js and ensure npm is available in PATH."
    )


def start_backend() -> subprocess.Popen:
    backend_app = BACKEND_DIR / "app.py"
    if not backend_app.exists():
        raise FileNotFoundError(f"Backend app not found: {backend_app}")

    env = os.environ.copy()
    env["HOST"] = "127.0.0.1"
    env["PORT"] = "10000"

    return subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=str(BACKEND_DIR),
        env=env,
    )


def ensure_frontend_deps() -> None:
    node_modules = FRONTEND_DIR / "node_modules"
    if node_modules.exists():
        return
    print("Installing frontend dependencies...")
    npm_cmd = resolve_npm_command()
    subprocess.run([npm_cmd, "install"], cwd=str(FRONTEND_DIR), check=True)


def start_frontend() -> subprocess.Popen:
    ensure_frontend_deps()
    npm_cmd = resolve_npm_command()
    return subprocess.Popen(
        [npm_cmd, "run", "dev", "--", "--host", "127.0.0.1", "--port", "8080"],
        cwd=str(FRONTEND_DIR),
    )


def terminate_process(proc: subprocess.Popen) -> None:
    if proc.poll() is not None:
        return
    try:
        proc.terminate()
        proc.wait(timeout=8)
    except Exception:
        try:
            proc.kill()
        except Exception:
            pass


def main() -> int:
    print("Starting backend and frontend...")
    if not BACKEND_DIR.exists():
        print(f"Missing backend directory: {BACKEND_DIR}")
        return 1
    if not FRONTEND_DIR.exists():
        print(f"Missing frontend directory: {FRONTEND_DIR}")
        return 1

    backend_proc = None
    frontend_proc = None
    try:
        backend_proc = start_backend()
        frontend_proc = start_frontend()

        print(f"Waiting for frontend at {FRONTEND_URL} ...")
        ready = wait_for_url(FRONTEND_URL, timeout_seconds=90)
        if not ready:
            print("Frontend did not become ready in time.")
            return 1

        print(f"Opening website: {FRONTEND_URL}")
        webbrowser.open(FRONTEND_URL)
        print("Press Ctrl+C to stop both servers.")

        while True:
            if backend_proc.poll() is not None:
                print("Backend stopped unexpectedly.")
                return 1
            if frontend_proc.poll() is not None:
                print("Frontend stopped unexpectedly.")
                return 1
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nStopping servers...")
        return 0
    except Exception as exc:
        print(f"Startup failed: {exc}")
        return 1
    finally:
        if frontend_proc:
            terminate_process(frontend_proc)
        if backend_proc:
            terminate_process(backend_proc)


if __name__ == "__main__":
    if os.name == "nt":
        signal.signal(signal.SIGINT, signal.default_int_handler)
    raise SystemExit(main())
