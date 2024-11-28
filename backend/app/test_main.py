from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome!"}

def test_process_notes():
    test_note = {
        "duration": 30,
        "type": "initial",
        "observations": "Test observation",
        "style": "detailed"
    }
    response = client.post("/api/notes", json=test_note)
    assert response.status_code == 200
    assert "professional_note" in response.json()

def test_save_note():
    test_save = {
        "session_date": "2024-03-27T10:00:00",
        "note_content": "Test note",
        "session_type": "initial",
        "duration": 30
    }
    response = client.post("/api/notes/save", json=test_save)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_regenerate_section():
    test_request = {
        "section": "subjective",
        "original_note": "Original note content",
        "session": {
            "duration": 30,
            "type": "initial",
            "observations": "Test"
        }
    }
    response = client.post("/api/notes/regenerate", json=test_request)
    assert response.status_code == 200
    assert "updated_note" in response.json()