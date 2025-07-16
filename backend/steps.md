🛡️ ArthRakshak Backend – Developer Docs
⚙️ Built with FastAPI, PostgreSQL, Docker, and pgAdmin4
📦 Repo: ArthRakshak-Hackathon

🚀 Project Setup (Local + Docker)
1️⃣ Prerequisites
Docker + Docker Compose

Git

VS Code or any IDE

2️⃣ Clone the Repo
bash
Copy
Edit
git clone https://github.com/MadhavArora1213/ArthRakshak-Hackathon.git
cd ArthRakshak-Hackathon/backend
3️⃣ Environment Config
Create a .env file inside /backend:

ini
Copy
Edit
DATABASE_URL=postgresql://postgres:1234@db:5432/arthrakshak
SECRET_KEY=supersecretkey
✅ .env is ignored via .gitignore for safety.

4️⃣ Start the Full Stack (API + DB + UI)
bash
Copy
Edit
docker-compose up --build
📢 Once started, you’ll see:

yaml
Copy
Edit
🌐 API Docs:        http://localhost:8000/docs
🔐 Admin Panel:     http://localhost:5050 (pgAdmin4)
🛢️  DB Host:        db | user: postgres | pass: 1234
5️⃣ Access pgAdmin4 UI (Database GUI)
URL: http://localhost:5050

Login:

Email: admin@admin.com

Password: admin123

To Add Server:

➕ Add New Server →
Name: ArthRakshak DB
Host: db
Port: 5432
Username: postgres
Password: 1234

🧠 Project Structure (Backend)
bash
Copy
Edit
backend/
├── api/
│   └── v1/
│       └── endpoints/      # All route files (auth, calc, fraud, goals, etc.)
├── core/                   # Settings, configs
├── db/                     # DB models, session, init
├── models/                 # SQLAlchemy models
├── schemas/                # Pydantic schemas
├── main.py                 # FastAPI entrypoint
├── Dockerfile              # Backend Docker setup
├── docker-compose.yml      # Multi-container setup
├── requirements.txt
└── .env                    # Local env config (ignored)
🧪 Test the API
Use Swagger UI at
🔗 http://localhost:8000/docs

Or use Postman with http://localhost:8000/

🛠️ Common Docker Commands
bash
Copy
Edit
# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build

# Clean cache & volumes (dangerous)
docker system prune -a
🐙 Git Workflow
bash
Copy
Edit
# Create and push changes to Backend branch
git checkout -b Backend
git add .
git commit -m "✅ Final backend setup"
git push origin Backend