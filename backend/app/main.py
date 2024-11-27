'''Defines FastAPI endpoint to process session notes.'''

from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, HTTPException

'''Adding CORS for handling servers running in different terminals'''

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

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
    try:
        # Mock response
        
        return {
            "status": "success",
            "professional_note": "Processed note will appear here"
        }
        
    except Exception as e:
        raise HTTPException(status_code = 500, detail = str(e))