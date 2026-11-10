"""Range-capable static server for local preview of this site.

Why: Python's built-in `python -m http.server` does NOT support HTTP Range
requests, so seeking in the ROS2 demo video silently fails. This server adds
206 Partial Content support so local preview behaves like GitHub Pages.

Usage:
    python3 tools/serve.py            # serves the site root on 127.0.0.1:4173
    python3 tools/serve.py 8080       # custom port
"""
import http.server
import os
import re
import socketserver
import sys
from pathlib import Path

ROOT = str(Path(__file__).resolve().parent.parent)
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


class LimitedReader:
    """Expose only the requested byte range to copyfile()."""

    def __init__(self, fileobj, length):
        self.fileobj = fileobj
        self.remaining = length

    def read(self, n=-1):
        if self.remaining <= 0:
            return b""
        if n is None or n < 0:
            n = self.remaining
        n = min(n, self.remaining)
        data = self.fileobj.read(n)
        self.remaining -= len(data)
        return data

    def close(self):
        self.fileobj.close()


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        range_header = self.headers.get("Range")
        if not range_header:
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(f.fileno()).st_size
        m = re.match(r"bytes=(\d*)-(\d*)", range_header.strip())
        if not m:
            f.close()
            self.send_error(416, "Requested Range Not Satisfiable")
            return None

        if m.group(1) == "" and m.group(2) != "":      # suffix range: bytes=-N
            start = max(0, size - int(m.group(2)))
            end = size - 1
        else:
            start = int(m.group(1)) if m.group(1) else 0
            end = int(m.group(2)) if m.group(2) else size - 1

        end = min(end, size - 1)
        if start >= size or start > end:
            f.close()
            self.send_error(416, "Requested Range Not Satisfiable")
            return None

        f.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(os.fstat(f.fileno()).st_mtime))
        self.end_headers()
        return LimitedReader(f, end - start + 1)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with Server(("127.0.0.1", PORT), Handler) as httpd:
        print("serving %s on http://127.0.0.1:%d" % (ROOT, PORT), flush=True)
        httpd.serve_forever()
