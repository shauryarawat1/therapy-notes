'''Defines FastAPI endpoint to process session notes. Includes access to Anthropic API'''

from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, HTTPException
from anthropic import Anthropic
import os
from dotenv import load_dotenv
from datetime import datetime

'''Adding CORS for handling servers running in different terminals'''

from fastapi.middleware.cors import CORSMiddleware

# Loads environment variables from .env
load_dotenv()
app = FastAPI()

anthropic_key = Anthropic(api_key = os.getenv('ANTHROPIC_API_KEY'))

origins = ["http://localhost:3000"]     # Accepting requests from frontend URL

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# Saves the note
class SavedNote(BaseModel):
    session_date: datetime
    note_content: str
    session_type: str
    duration: int
    
 
@app.post("/api/notes/save")
async def save_note(note: SavedNote):
    try:
        return {
            "status": "success",
            "message": "Note saved successfully",
            "saved_at": datetime.now()
        }
        
    except Exception as e:
        raise HTTPException(status_code = 500, detail = str(e))
    
class RegenerateRequest(BaseModel):
    section: str
    original_note: str
    session: dict
    
@app.post("/api/notes/regenerate")
async def regenerate_section(request: RegenerateRequest):
    try:
        prompt = f"""Regenerate only the {request.section.upper()} section of this SOAP note, keeping other sections unchanged:

        Original note:
        {request.original_note}

        Session details:
        Duration: {request.session['duration']} minutes
        Type: {request.session['type']}
        Observations: {request.session['observations']}
        
        Generate only a new {request.section.upper()} section maintaining clinical writing style."""
        
        response = anthropic_key.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return {
            "status": "success",
            "updated_note": response.content[0].text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
     

'''Route for root URL'''
@app.get("/")

async def read_root():
    return {"message": "Welcome!"}

class SessionNote(BaseModel):
    duration: int
    type: str
    observations: str
    style: str
    
'''Listens for POST requests'''
@app.post("/api/notes")

async def process_notes(note: SessionNote):
    '''Request handling'''
    
    # Creates prompt for Anthropic API and returns the response
    try:
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
        
        response = anthropic_key.messages.create(
            model = "claude-3-opus-20240229",
            max_tokens = 1000,
            messages = [{"role": "user", "content": prompt}]
        )
        
        return {
            "status": "success",
            "professional_note": response.content[0].text
        }
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code = 500, detail = str(e))