from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from services.ai_service import validate_requirement_ai

router = APIRouter(prefix="/isn", tags=["ISN"])

@router.post("/requirements/{req_id}/validate", response_model=schemas.Requirement)
def validate_requirement(req_id: int, db: Session = Depends(get_db)):
    db_req = db.query(models.Requirement).filter(models.Requirement.id == req_id).first()
    if not db_req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    
    # Call Gemini to enhance description
    enhanced_desc = validate_requirement_ai(db_req.description)
    db_req.ai_validated_description = enhanced_desc
    db.commit()
    db.refresh(db_req)
    return db_req

@router.get("/submissions/{req_id}")
def get_submissions_for_requirement(req_id: int, db: Session = Depends(get_db)):
    # Returns a cumulative tabular report of Contractor submissions for a specific requirement
    submissions = db.query(models.Submission).filter(models.Submission.requirement_id == req_id).all()
    
    results = []
    for sub in submissions:
        contractor = db.query(models.User).filter(models.User.id == sub.contractor_id).first()
        results.append({
            "submission_id": sub.id,
            "contractor_name": contractor.username if contractor else "Unknown",
            "worker_ids": sub.worker_ids,
            "suggested_rate": sub.suggested_rate,
            "readiness_date": sub.readiness_date
        })
    return results
