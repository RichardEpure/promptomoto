FROM python:3.13-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Seed the database and start the server
CMD ["sh", "-c", "uv run python populate_db.py && uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
