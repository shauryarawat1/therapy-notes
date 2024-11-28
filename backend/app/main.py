# Import necessary libraries
from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, HTTPException
from anthropic import Anthropic
import os
from dotenv import load_dotenv
from datetime import datetime

from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# Create a FastAPI application
app = FastAPI()

# Initialize the Anthropic API with the API key
anthropic_key = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

# Define the origins for CORS
origins = ["http://localhost:3000"]

# Add CORS middleware to the application, recommended by AI
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a Pydantic model for the saved note
class SavedNote(BaseModel):
    session_date: datetime
    note_content: str
    session_type: str
    duration: int

# Define a route to save a note
@app.post("/api/notes/save")
async def save_note(note: SavedNote):
    try:
        # Save the note and return a success response
        return {
            "status": "success",
            "message": "Note saved successfully",
            "saved_at": datetime.now()
        }
    except Exception as e:
        # Raise an HTTP exception if there is an error
        raise HTTPException(status_code=500, detail=str(e))

# Define a Pydantic model for the regenerate request
class RegenerateRequest(BaseModel):
    section: str
    original_note: str
    session: dict

# Define a route to regenerate a section of a note, AI generated
@app.post("/api/notes/regenerate")
async def regenerate_section(request: RegenerateRequest):
    try:
        # Create a prompt for the Anthropic API
        prompt = f"""Regenerate only the {request.section.upper()} section of this SOAP note, keeping other sections unchanged:

        Original note:
        {request.original_note}

        Session details:
        Duration: {request.session['duration']} minutes
        Type: {request.session['type']}
        Observations: {request.session['observations']}
        
        Generate only a new {request.section.upper()} section maintaining clinical writing style."""
        
        # Send the prompt to the Anthropic API and get the response
        response = anthropic_key.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Return the updated note
        return {
            "status": "success",
            "updated_note": response.content[0].text
        }
    except Exception as e:
        # Raise an HTTP exception if there is an error
        raise HTTPException(status_code=500, detail=str(e))

# Define a route for the root URL
@app.get("/")
async def read_root():
    return {"message": "Welcome!"}

# Define a Pydantic model for the session note
class SessionNote(BaseModel):
    duration: int
    type: str
    observations: str
    style: str

# Define a route to process a session note
@app.post("/api/notes")
async def process_notes(note: SessionNote):
    try:
        # Create a prompt for the Anthropic API based on the note style. AI generated prompt request
        style_prompts = {
            "detailed": "Format as a detailed SOAP note with comprehensive sections for Subjective, Objective, Assessment, and Plan.",
            "brief": "Create a concise summary focusing on key points in a brief SOAP format.",
            "narrative": "Write in a narrative style while maintaining clinical professionalism."
        }
        
        prompt = f"""Convert the therapy session notes using {style_prompts[note.style]}:
        
        Session Info:     
        Duration: {note.duration} minutes
        Type: {note.type}
        Observations: {note.observations}
        
        Use double line breaks between sections for clarity.
        """
        
        # Send the prompt to the Anthropic API and get the response
        response = anthropic_key.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Return the professional note
        return {
            "status": "success",
            "professional_note": response.content[0].text
        }
    except Exception as e:
        # Raise an HTTP exception if there is an error
        raise HTTPException(status_code=500, detail=str(e))