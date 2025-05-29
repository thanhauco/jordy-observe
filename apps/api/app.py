import os
import time
from typing import Any, Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from .core.config import settings
from .routers import (
    auth,
    projects,
    traces,
    evaluations,
    prompts,
    datasets,
    webhooks,
    collaboration,
    organizations
)
from .core.database import engine, Base

# Set up logging
logger.add("logs/api.log", rotation="500 MB", level="INFO")

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Enterprise AI Observability & Agent Engineering Platform",
        version="1.0.0",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
    )

    # Set up CORS
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Middleware for request timing and logging
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response

    # Include Routers
    app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
    app.include_router(organizations.router, prefix=f"{settings.API_V1_STR}/organizations", tags=["organizations"])
    app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
    app.include_router(traces.router, prefix=f"{settings.API_V1_STR}/traces", tags=["traces"])
    app.include_router(evaluations.router, prefix=f"{settings.API_V1_STR}/evaluations", tags=["evaluations"])
    app.include_router(prompts.router, prefix=f"{settings.API_V1_STR}/prompts", tags=["prompts"])
    app.include_router(datasets.router, prefix=f"{settings.API_V1_STR}/datasets", tags=["datasets"])
    app.include_router(webhooks.router, prefix=f"{settings.API_V1_STR}/webhooks", tags=["webhooks"])
    app.include_router(collaboration.router, prefix=f"{settings.API_V1_STR}/collaboration", tags=["collaboration"])

    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "version": "1.0.0"
        }

    return app

app = create_app()

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Jordy Observe API...")
    # Optional: Base.metadata.create_all(bind=engine) - usually handled by alembic

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Jordy Observe API...")
