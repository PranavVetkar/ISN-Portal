from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from db import init_db, get_db, pwd_context
import sqlite3
import uvicorn
from contextlib import asynccontextmanager

from routers import hiring_client, safeworks, contractor

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database and pre-populate users
    init_db()
    yield

app = FastAPI(title="Safeworks Portal API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Login Schema
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    id: int
    email: str
    role: str
    name: str

@app.post("/api/login", response_model=LoginResponse)
def login(request: LoginRequest, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("SELECT id, email, password_hash, role, name FROM users WHERE email = ?", (request.email,))
    user = cursor.fetchone()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    # Verify password
    if not pwd_context.verify(request.password, user['password_hash']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    return {
        "id": user['id'],
        "email": user['email'],
        "role": user['role'],
        "name": user['name']
    }

# Include routers
app.include_router(hiring_client.router)
app.include_router(safeworks.router)
app.include_router(contractor.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Safeworks Portal API"}
