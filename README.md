# Safeworks Portal

A streamlined platform connecting Hiring Clients, Safeworks Admins and Contractors using AI-powered requirement validation.

## Tech Stack
- **Frontend**: Angular 18 (Standalone Components, Vanilla CSS)
- **Backend**: FastAPI (Python 3.13)
- **Database**: raw SQLite3
- **AI**: Gemini 2.5 Flash API

## Setup

### Backend
1. `cd backend`
2. `python -m venv venv && source venv/bin/activate`
3. `pip install -r requirements.txt`
4. `export GEMINI_API_KEY="your_key"`
5. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## Default Hard-coded Users
Password for all: `password123`
- **HC**: `hc1@test.com`
- **Safeworks**: `safeworks@test.com`
- **Contractor**: `c1@test.com`
