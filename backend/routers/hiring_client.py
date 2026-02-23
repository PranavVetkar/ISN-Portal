from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter(prefix="/hc", tags=["Hiring Client"])

@router.post("/requirements/", response_model=schemas.Requirement)
def create_requirement(req: schemas.RequirementCreate, db: Session = Depends(get_db)):
    db_req = models.Requirement(**req.model_dump())
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

@router.get("/requirements/", response_model=List[schemas.Requirement])
def list_requirements(db: Session = Depends(get_db)):
    return db.query(models.Requirement).all()
