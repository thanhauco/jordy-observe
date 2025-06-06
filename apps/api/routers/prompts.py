from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_prompts():
    return []

@router.post("/")
async def create_prompt():
    return {"id": "p_1"}

@router.post("/optimize")
async def optimize_prompt():
    return {"suggestion": "..."}
