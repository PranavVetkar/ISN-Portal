from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from services.ai_service import check_worker_compatibility

router = APIRouter(prefix="/contractor", tags=["Contractor"])

@router.get("/workers/{contractor_id}", response_model=List[schemas.Worker])
def get_workers(contractor_id: int, db: Session = Depends(get_db)):
    return db.query(models.Worker).filter(models.Worker.contractor_id == contractor_id).all()

@router.post("/workers/compatibility")
def check_compatibility(req_id: int, worker_id: int, db: Session = Depends(get_db)):
    requirement = db.query(models.Requirement).filter(models.Requirement.id == req_id).first()
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()

    if not requirement or not worker:
        raise HTTPException(status_code=404, detail="Requirement or Worker not found")

    req_details = {
        "name": requirement.name,
        "description": requirement.description or "No description",
        "workers_required": requirement.workers_required,
        "start_date": requirement.start_date.isoformat() if requirement.start_date else None
    }
    
    worker_details = {
        "name": worker.name,
        "certifications": worker.certifications,
        "years_experience": worker.years_experience
    }

    result = check_worker_compatibility(req_details, worker_details)
    return result

@router.post("/submissions", response_model=schemas.Submission)
def create_submission(submission: schemas.SubmissionCreate, db: Session = Depends(get_db)):
    db_submission = models.Submission(
        contractor_id=1, # Mock currently logged-in contractor
        **submission.model_dump()
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission
