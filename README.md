# Alpaca Health Professional Therapy Note Generator

A full-stack application that helps therapists convert session observations into professional clinical notes using AI.

## Features

- Quick session observations input
- Customizable session parameters
- AI-powered note generation
- Edit and refine generated notes
- Save functionality
- Section regeneration
- Multiple note styles (SOAP, Brief, Narrative)

## Tech Stack

- Frontend: Next.js with TypeScript
- Backend: FastAPI (Python)
- AI: Anthropic Claude API

## Setup
### Prerequisites
- Python 3.11+
- Node.js 18+
- Anthropic API key

### Backend Setup
1. Create and activate virtual environment in main directory (use Bash):
    - python -m venv alpaca_venv
    - source alpaca_venv/Scripts/Activate

2. Install dependencies from the requirements.txt of the original repository

3. Install fastapi, fastapi-cli, dotenv, CORSMiddleware, os, datetime, dotenv

4. Create .env file with your ANTHROPIC API KEY

5. Start the server using fastapi dev main.py

### Frontend Setup

1. Navigate to frontend using cd frontend

2. Install dependencies using npm install

3. Start the server by npm run dev

4. Frontend runs at http://localhost:3000

## How to use the app
- In one terminal, activate front end server by cd frontend -> npm run dev
- In another terminal, activate backend server by activate virtual environment -> cd backend/app -> fastapi dev main.py
- Access http://localhost:3000 for the interface

## Usage

1. Enter session duration and type

2. Input observations in free form

3. Select desired note style (SOAP, Brief, Narrative)

4. Generate professional notes

5. Edit generated content if needed

6. Regenerate specific sections

7. Save final version

## API Endpoints

- POST /api/notes: Generate professional notes
- POST /api/notes/save: Save final notes
- POST /api/notes/regenerate: Regenerate specific sections

## Technical Decisions

- Used Next.js for frontend to leverage server-side rendering and TypeScript support
- Implemented FastAPI backend for high performance and easy API development
- Integrated Claude API for high-quality clinical note generation
- Added section regeneration for granular control
- Implemented multiple note styles for flexibility

## Future Improvements

- Add user authentication

- Implement note history (For continuing therapy sessions)

- Add more customization options for AI style

- Enhanced error handling





