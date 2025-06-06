from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def create_org(name: str):
    return {"id": "org_123", "name": name}

@router.get("/")
async def list_orgs():
    return [{"id": "org_123", "name": "Default Org"}]
