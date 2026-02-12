from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from app.database import create_db_and_tables
from app.routers import users


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(users.router)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")
