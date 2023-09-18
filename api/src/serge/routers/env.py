import os

from fastapi import APIRouter

env_router = APIRouter(
    prefix="/env",
    tags=["env"],
)


@env_router.get("/")
def getEnv():
    return {
      "modelsUrl": os.environ["MODELS_URL"],
      "cpus": os.environ["CPUS"]
    }
