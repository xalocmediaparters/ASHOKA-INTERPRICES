"""
Ashoka Enterprises Website - Simple HTTP Server
This script serves the static website locally for development/testing
"""

import http.server
import socketserver
import os
import sys

# Configuration
PORT = 8000
DIRECTORY = "."

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Enable CORS for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom logging format
        print(f"[{self.log_date_time_string()}] {format % args}")


def start_server():
    """Start the HTTP server"""
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print("=" * 60)
            print("🌞 Ashoka Enterprises Website Server")
            print("=" * 60)
            print(f"📍 Server running at: http://localhost:{PORT}")
            print(f"📁 Serving files from: {os.path.abspath(DIRECTORY)}")
            print("=" * 60)
            print("Press Ctrl+C to stop the server")
            print("=" * 60)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48 or e.errno == 98:  # Port already in use
            print(f"❌ Error: Port {PORT} is already in use.")
            print(f"   Please close the application using port {PORT} or change the PORT variable.")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    # Check if index.html exists
    if not os.path.exists("index.html"):
        print("❌ Error: index.html not found in current directory")
        print(f"   Current directory: {os.path.abspath(DIRECTORY)}")
        print("   Please run this script from the project root directory")
        sys.exit(1)
    
    start_server()