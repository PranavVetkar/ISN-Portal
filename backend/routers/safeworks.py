from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from typing import List
from pydantic import BaseModel
from db import get_db
from services.ai_service import validate_requirement_ai

router = APIRouter(prefix="/safeworks", tags=["Safeworks"])

class RequirementResponse(BaseModel):
    id: int
    hc_id: int
    name: str
    description: str
    workers_required: int
    start_date: str
    ai_validated_description: str | None = None

class ForwardRequest(BaseModel):
    contractor_ids: List[int]

class SubmissionResponse(BaseModel):
    submission_id: int
    contractor_name: str
    worker_ids: str
    suggested_rate: float
    readiness_date: str

@router.get("/requirements/")
def list_all_requirements(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM requirements")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@router.post("/requirements/{req_id}/validate", response_model=RequirementResponse)
def validate_requirement(req_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM requirements WHERE id = ?", (req_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Requirement not found")
    
    req_dict = dict(row)
    enhanced_desc = validate_requirement_ai(req_dict['description'])
    
    cursor.execute('''
        UPDATE requirements 
        SET ai_validated_description = ? 
        WHERE id = ?
    ''', (enhanced_desc, req_id))
    db.commit()
    
    cursor.execute("SELECT * FROM requirements WHERE id = ?", (req_id,))
    updated_row = cursor.fetchone()
    return dict(updated_row)

@router.post("/requirements/{req_id}/forward")
def forward_requirement(req_id: int, request: ForwardRequest, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    
    # insert each contractor
    for contractor_id in request.contractor_ids:
        try:
            cursor.execute('''
                INSERT INTO requirement_assignments (requirement_id, contractor_id)
                VALUES (?, ?)
            ''', (req_id, contractor_id))
        except sqlite3.IntegrityError:
            pass # ignore duplicates
            
    db.commit()
    return {"message": "Requirement successfully forwarded to selected contractors."}

@router.get("/submissions/{req_id}", response_model=List[SubmissionResponse])
def get_submissions_for_requirement(req_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute('''
        SELECT s.id as submission_id, u.name as contractor_name, s.worker_ids, s.suggested_rate, s.readiness_date
        FROM submissions s
        JOIN users u ON s.contractor_id = u.id
        WHERE s.requirement_id = ?
    ''', (req_id,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]
