'''Defines FastAPI endpoint to process session notes. Includes access to Anthropic API'''

from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, HTTPException
from anthropic import Anthropic
import os
from dotenv import load_dotenv

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

'''Route for root URL'''
@app.get("/")

async def read_root():
    return {"message": "Welcome!"}

class SessionNote(BaseModel):
    duration: int
    type: str
    observations: str
    
'''Listens for POST requests'''
@app.post("/api/notes")

async def process_notes(note: SessionNote):
    '''Request handling'''
    
    # Creates prompt for Anthropic API and returns the response
    try:
        prompt = f"""Convert the therapy session notes into professional notes:
        Session Info:
        
        Duration: {note.duration} minutes
        Type: {note.type}
        Observations: {note.observations}
        
        Please format as a clinical SOAP note with clear sections:
        - Subjective (S): Client's symptoms, concerns, and reported experiences
        - Objective (O): Observable behaviors and clinical observations
        - Assessment (A): Clinical assessment and analysis
        - Plan (P): Treatment plan and next steps
        
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