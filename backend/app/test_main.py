# Import the TestClient from FastAPI
from fastapi.testclient import TestClient

# Import the FastAPI application from the main module
from main import app

# Create a test client for the application
client = TestClient(app)

# Define a test for the health check endpoint
def test_health_check():
    # Send a GET request to the root URL
    response = client.get("/")
    
    # Assert that the response status code is 200
    assert response.status_code == 200
    
    # Assert that the response JSON is as expected
    assert response.json() == {"message": "Welcome!"}

# Define a test for the process notes endpoint
def test_process_notes():
    # Define a test note payload
    test_note = {
        "duration": 30,
        "type": "initial",
        "observations": "Test observation",
        "style": "detailed"
    }
    
    # Send a POST request to the process notes endpoint with the test note payload
    response = client.post("/api/notes", json=test_note)
    
    # Assert that the response status code is 200
    assert response.status_code == 200
    
    # Assert that the response JSON contains the expected key
    assert "professional_note" in response.json()

# Define a test for the save note endpoint
def test_save_note():
    # Define a test save payload
    test_save = {
        "session_date": "2024-03-27T10:00:00",
        "note_content": "Test note",
        "session_type": "initial",
        "duration": 30
    }
    
    # Send a POST request to the save note endpoint with the test save payload
    response = client.post("/api/notes/save", json=test_save)
    
    # Assert that the response status code is 200
    assert response.status_code == 200
    
    # Assert that the response JSON contains the expected status
    assert response.json()["status"] == "success"

# Define a test for the regenerate section endpoint
def test_regenerate_section():
    # Define a test regenerate request payload
    test_request = {
        "section": "subjective",
        "original_note": "Original note content",
        "session": {
            "duration": 30,
            "type": "initial",
            "observations": "Test"
        }
    }
    
    # Send a POST request to the regenerate section endpoint with the test request payload
    response = client.post("/api/notes/regenerate", json=test_request)
    
    # Assert that the response status code is 200
    assert response.status_code == 200
    
    # Assert that the response JSON contains the expected key
    assert "updated_note" in response.json()