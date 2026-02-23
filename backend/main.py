from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import hiring_client, isn, contractor

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ISN Portal API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(hiring_client.router)
app.include_router(isn.router)
app.include_router(contractor.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to ISN Portal API"}
