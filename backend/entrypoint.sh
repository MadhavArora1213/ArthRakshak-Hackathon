#!/bin/bash

echo "🔄 Starting ArthRakshak API Server..."

# Start the FastAPI server in background
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# Optional: wait briefly for Uvicorn to boot
sleep 2

# Print helpful dev links
echo ""
echo "✅ ArthRakshak Services are Ready!"
echo ""
echo "🌐 API Docs:        http://localhost:8000/docs"
echo "🔐 Admin Panel:     http://localhost:5050  (pgAdmin4)"
echo "🛢️  DB:             postgresql://postgres:1234@db:5432/arthrakshak"
echo "📂 Mounted Volume:  ./app in container"
echo ""
echo "👥 pgAdmin Login:   admin@admin.com | admin123"
echo ""
wait
