from fastapi import APIRouter

router = APIRouter()

@router.post("/token")
async def login():
    return {"access_token": "dummy_token", "token_type": "bearer"}

@router.post("/register")
async def register():
    return {"status": "user created"}
