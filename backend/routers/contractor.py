from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from typing import List, Dict, Any
from pydantic import BaseModel
from db import get_db
from services.ai_service import check_worker_compatibility

router = APIRouter(prefix="/contractor", tags=["Contractor"])

class WorkerResponse(BaseModel):
    id: int
    contractor_id: int
    name: str
    certifications: str
    years_experience: int

class SubmissionCreate(BaseModel):
    requirement_id: int
    contractor_id: int
    worker_ids: str
    suggested_rate: float
    readiness_date: str

@router.get("/requirements/{contractor_id}")
def get_assigned_requirements(contractor_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute('''
        SELECT r.* FROM requirements r
        JOIN requirement_assignments ra ON r.id = ra.requirement_id
        WHERE ra.contractor_id = ?
    ''', (contractor_id,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@router.get("/workers/{contractor_id}", response_model=List[WorkerResponse])
def get_workers(contractor_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM workers WHERE contractor_id = ?", (contractor_id,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@router.post("/workers/compatibility")
def check_compatibility(req_id: int, worker_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM requirements WHERE id = ?", (req_id,))
    req_row = cursor.fetchone()
    
    cursor.execute("SELECT * FROM workers WHERE id = ?", (worker_id,))
    worker_row = cursor.fetchone()

    if not req_row or not worker_row:
        raise HTTPException(status_code=404, detail="Requirement or Worker not found")

    req_details = {
        "name": req_row['name'],
        "description": req_row['description'] or "No description",
        "workers_required": req_row['workers_required'],
        "start_date": req_row['start_date']
    }
    
    worker_details = {
        "name": worker_row['name'],
        "certifications": worker_row['certifications'],
        "years_experience": worker_row['years_experience']
    }

    result = check_worker_compatibility(req_details, worker_details)
    return result

@router.post("/submissions")
def create_submission(submission: SubmissionCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO submissions (requirement_id, contractor_id, worker_ids, suggested_rate, readiness_date)
        VALUES (?, ?, ?, ?, ?)
    ''', (submission.requirement_id, submission.contractor_id, submission.worker_ids, submission.suggested_rate, submission.readiness_date))
    db.commit()
    sub_id = cursor.lastrowid
    
    cursor.execute("SELECT * FROM submissions WHERE id = ?", (sub_id,))
    row = cursor.fetchone()
    return dict(row)
