from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from typing import List
from pydantic import BaseModel
from db import get_db

router = APIRouter(prefix="/hc", tags=["Hiring Client"])

class RequirementCreate(BaseModel):
    hc_id: int
    name: str
    description: str
    workers_required: int
    start_date: str

class RequirementResponse(BaseModel):
    id: int
    hc_id: int
    name: str
    description: str
    workers_required: int
    start_date: str
    ai_validated_description: str | None = None

@router.post("/requirements/", response_model=RequirementResponse)
def create_requirement(req: RequirementCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO requirements (hc_id, name, description, workers_required, start_date)
        VALUES (?, ?, ?, ?, ?)
    ''', (req.hc_id, req.name, req.description, req.workers_required, req.start_date))
    db.commit()
    req_id = cursor.lastrowid
    
    # Fetch the inserted requirement
    cursor.execute("SELECT * FROM requirements WHERE id = ?", (req_id,))
    row = cursor.fetchone()
    return dict(row)

@router.get("/requirements/{hc_id}", response_model=List[RequirementResponse])
def list_requirements(hc_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM requirements WHERE hc_id = ?", (hc_id,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]
