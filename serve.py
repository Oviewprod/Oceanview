#!/usr/bin/env python3
import os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.argv = ['', '3456']
import http.server, socketserver

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(format % args)

with socketserver.TCPServer(("", 3456), Handler) as httpd:
    print("Ocean View — http://localhost:3456")
    httpd.serve_forever()
