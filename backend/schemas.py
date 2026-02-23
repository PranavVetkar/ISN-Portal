from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class RequirementBase(BaseModel):
    name: str
    description: str
    workers_required: int
    start_date: date

class RequirementCreate(RequirementBase):
    pass

class Requirement(RequirementBase):
    id: int
    ai_validated_description: Optional[str] = None

    class Config:
        from_attributes = True

class WorkerBase(BaseModel):
    name: str
    certifications: str
    years_experience: int

class WorkerCreate(WorkerBase):
    contractor_id: int

class Worker(WorkerBase):
    id: int
    contractor_id: int

    class Config:
        from_attributes = True

class SubmissionBase(BaseModel):
    requirement_id: int
    worker_ids: str
    suggested_rate: float
    readiness_date: date

class SubmissionCreate(SubmissionBase):
    pass

class Submission(SubmissionBase):
    id: int
    contractor_id: int

    class Config:
        from_attributes = True
