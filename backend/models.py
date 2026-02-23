from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    role = Column(String)  # 'hc', 'isn', 'contractor'

class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    workers_required = Column(Integer)
    start_date = Column(Date)
    ai_validated_description = Column(String, nullable=True)

    # Relationships
    submissions = relationship("Submission", back_populates="requirement")

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    contractor_id = Column(Integer, ForeignKey("users.id"))
    certifications = Column(String) # Comma separated for simplicity
    years_experience = Column(Integer)

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    requirement_id = Column(Integer, ForeignKey("requirements.id"))
    contractor_id = Column(Integer, ForeignKey("users.id"))
    worker_ids = Column(String) # Comma separated list of worker IDs
    suggested_rate = Column(Float)
    readiness_date = Column(Date)

    # Relationships
    requirement = relationship("Requirement", back_populates="submissions")

