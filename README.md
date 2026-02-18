# Promptomoto

Promptomoto is a platform for users to discover and share their AI prompts. The project is deployed via Railway and is available here: [promptomoto.com](https://promptomoto.com)

The demo site has the following credentials available for testing. These are also seeded into local instances via `populate_db.py`:

- **Username**: `user`
- **Password**: `useruser`

- **Admin Username**: `admin`
- **Admin Password**: `adminadmin`

## Features

- **Prompt Discovery**: Browse and search through a collection of AI prompts.
- **Prompt Management**: Create, edit, and delete your own prompts.
- **User Authentication**: Secure sign-up and login using JWT for users to manage their prompts.

## Technology Stack

**Backend**: Python, FastAPI, SQLite, SQLModel, Pydantic

**Frontend**: Next.js, React, TypeScript, Tailwind CSS, TanStack Query, Zod, Shadcn

## Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (for Docker setup)
- [Python 3.13](https://www.python.org/) and [uv](https://docs.astral.sh/uv/) (for local backend)
- [Bun](https://bun.sh/) (for local frontend)

### Backend Environment

Create a `backend/.env` file with the following variables:

```
SECRET_KEY=yoursecretkeyhere
ADMIN_API_KEY=youradminapikeyhere
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Docker

From the project root, ensure you've created the `backend/.env` file described above, then run:

```bash
docker compose up --build
```

If you've made changes and the build is serving stale code, rebuild without cache:

```bash
docker compose build --no-cache && docker compose up
```

This starts the backend on port **8000** and the frontend on port **3000**. The database is seeded automatically on first run.

### Local Development

**Backend**

```bash
cd backend
uv sync
uv run python populate_db.py  # seed the database (optional)
uv run fastapi dev
```

The API will be available at `http://localhost:8000`. Swagger docs are at `http://localhost:8000/docs`.

**Frontend**

```bash
cd frontend
bun install
bun dev
```

The app will be available at `http://localhost:3000`. Browser API requests are proxied to the backend via Next.js rewrites, while server-side requests are sent directly to `NEXT_PUBLIC_API_URL` configured in `.env.development`.
