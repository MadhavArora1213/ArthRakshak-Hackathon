# 🛡️ ArthRakshak Backend – Developer Docs

> Secure Finance APIs built with FastAPI, PostgreSQL, and Docker  
> 💼 Built for Hackathons & Real-world Finance Apps

---

## 🚀 Tech Stack

- **FastAPI** – Modern Python backend
- **PostgreSQL** – Relational DB (via Docker)
- **SQLAlchemy** – ORM for models
- **Pydantic** – Data validation
- **Docker + Docker Compose** – Containerization
- **pgAdmin 4** – UI for managing PostgreSQL

---


## 📂 Project Structure

backend/
├── api/ # Feature modules (auth, calc, fraud, goals, etc.)
│ └── v1/endpoints/
├── core/ # Configuration setup
├── db/ # DB connection/init logic
├── models/ # SQLAlchemy models
├── schemas/ # Pydantic request/response validation
├── main.py # App entry point
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env # Environment config (excluded from Git)


---

## ⚙️ Setup Instructions

### 1. Clone & Navigate

```bash
git clone https://github.com/MadhavArora1213/ArthRakshak-Hackathon.git
cd ArthRakshak-Hackathon/backend
2. Create .env File
env
Copy
Edit
DATABASE_URL=postgresql://postgres:1234@db:5432/arthrakshak
SECRET_KEY=supersecretkey
.env is already added to .gitignore

3. Start with Docker
bash
Copy
Edit
docker-compose up --build
✅ On success, access:

🔗 API Docs → http://localhost:8000/docs

🛢️ pgAdmin 4 → http://localhost:5050

👨‍💻 DB Credentials:

Host: db

User: postgres

Pass: 1234

DB: arthrakshak

🧑‍💻 Using pgAdmin4
After visiting http://localhost:5050

Login with:

Email: admin@admin.com

Password: admin123

Add a new server:

Name: ArthRakshak DB

Host: db

Port: 5432

Username: postgres

Password: 1234

✅ Click Save → You'll see your database.

🔍 API Testing
Swagger UI → http://localhost:8000/docs

Redoc UI → http://localhost:8000/redoc

Postman Base URL → http://localhost:8000

📜 Docker Overview
bash
Copy
Edit
# Start containers
docker-compose up --build

# Stop containers
docker-compose down

# Live logs
docker-compose logs -f

# Clean unused images (optional)
docker system prune -a
🗂️ .gitignore (Root)
gitignore
Copy
Edit
# Python
__pycache__/
*.py[cod]
*.sqlite3

# Environment
.env
venv/
env/

# Editor & OS
.vscode/
.idea/
.DS_Store
🐙 GitHub Commands (Private Repo)
bash
Copy
Edit
# Create and switch to branch
git checkout -b Backend

# Stage and commit
git add .
git commit -m "✅ Setup backend with Docker & pgAdmin"

# Push to remote branch
git push origin Backend
✅ Dev Ready Summary
Component	Status
FastAPI API	✅
PostgreSQL DB	✅
Docker Services	✅
pgAdmin UI	✅
.env Protected	✅
API Docs	✅

Built with ❤️ for Hackathons & Real Impact
Team ArthRakshak | #FinanceSecured

yaml
Copy
Edit

---

Let me know if you'd like it pushed directly to your repo or saved as a downloadable file.








Ask ChatGPT



Tools


