# backend/Dockerfile
# ────────────────────────────────────────────────────────────────────────────
# Build a tiny, production‑ready image for the FastAPI backend.
# ────────────────────────────────────────────────────────────────────────────

FROM python:3.10-slim

# ── 1. system tooling ───────────────────────────────────────────────────────
RUN apt-get update \
 && apt-get install --no-install-recommends -y postgresql-client netcat-traditional \
 && rm -rf /var/lib/apt/lists/*

# ── 2. non‑root user & workspace ────────────────────────────────────────────
RUN useradd -ms /bin/bash appuser
WORKDIR /app
ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1

# ── 3. Python dependencies ─────────────────────────────────────────────────
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# ── 4. project source code ─────────────────────────────────────────────────
COPY . .

# normalise line‑endings & ensure exec bits (protects against Windows CRLF)
RUN sed -i 's/\r$//' /app/entrypoint.sh /app/scripts/wait-for-db.sh \
 && chmod +x /app/entrypoint.sh /app/scripts/wait-for-db.sh

USER appuser
EXPOSE 8000

# ── 5. start‑up script ─────────────────────────────────────────────────────
ENTRYPOINT ["/app/entrypoint.sh"]
