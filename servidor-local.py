"""Servidor local para testar o site antes do commit.
Uso:  python servidor-local.py   (ou: py servidor-local.py)
Abrir: http://localhost:8080
Imita a Cloudflare: /servicos abre servicos.html (sem .html).
"""
import http.server, os, socketserver

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?")[0].split("#")[0]
        if path != "/" and not os.path.splitext(path)[1] and os.path.isfile(path.lstrip("/") + ".html"):
            self.path = path + ".html"
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Site em http://localhost:%d  (Ctrl+C para parar)" % PORT)
    httpd.serve_forever()
