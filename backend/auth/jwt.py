from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
from jose import jwt
import os

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"

def get_current_user(credentials=Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=[ALGORITHM],
            audience="authenticated"
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
