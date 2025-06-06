from fastapi import APIRouter

router = APIRouter()

@router.post("/github")
async def github_webhook(payload: dict):
    # Process GitHub push events for prompt synchronization
    return {"status": "success", "processed": True}

@router.post("/generic")
async def generic_webhook(payload: dict):
    return {"status": "received"}
