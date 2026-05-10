# Stage 1 — Build Next.js frontend
FROM node:20-slim AS frontend-builder
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=""
RUN npm run build

# Stage 2 — Python + Node.js runtime
FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python deps via uv
RUN pip install --no-cache-dir uv
COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev

# Application code
COPY src/ ./src/
COPY ui/  ./ui/
COPY api/ ./api/
COPY chroma_db/ ./chroma_db/

# Built Next.js standalone artifacts from stage 1
COPY --from=frontend-builder /build/.next/standalone ./frontend/
COPY --from=frontend-builder /build/.next/static     ./frontend/.next/static
COPY --from=frontend-builder /build/public           ./frontend/public

COPY supervisord.conf /etc/supervisor/conf.d/app.conf

ENV USE_GROQ=true
EXPOSE 7860
HEALTHCHECK CMD curl -f http://localhost:7860/api/health || exit 1
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/app.conf"]
