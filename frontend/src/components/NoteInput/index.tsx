"use client"; // Enable client-side features in Next.js, AI generated

import { useState } from 'react'

export default function NoteInput() {
  // State management for form inputs and UI states
  const [session, setSession] = useState({
    duration: '',
    type: '',
    observations: ''
  })
  const [result, setResult] = useState("") // Stores AI-generated note
  const [loading, setLoading] = useState(false) // Loading state for API calls
  const [error, setError] = useState("") // Error message state
  const [editableNote, setEditableNote] = useState("") // Editable version of generated note
  const [saveStatus, setSaveStatus] = useState("") // Save operation status
  const [noteStyle, setNoteStyle] = useState("detailed") // AI note generation style

  // Handler for saving edited notes
  const handleSave = async() => {
    setSaveStatus("Saving...");
    try {
      const response = await fetch('http://localhost:8000/api/notes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_date: new Date(),
          note_content: editableNote,
          session_type: session.type,
          duration: parseInt(session.duration)
        })
      });
      const data = await response.json();
      setSaveStatus("Saved successfully!")
    } catch(error) {
      setSaveStatus("Error saving note");
      console.error(error);
    }
  }

  // Handler for regenerating specific sections of the note
  const regenerateSection = async (section: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/notes/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: section,
          original_note: editableNote,
          session: session
        })
      });
      const data = await response.json();
      setEditableNote(data.updated_note);
    } catch (error) {
      setError("Failed to regenerate section");
    }
    setLoading(false);
  };

  // Main form submission handler for generating notes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Form validation
    if (!session.duration || !session.type || !session.observations) {
      setError("All fields required");
      return;
    }
    
    setLoading(true);
    try {
      // Call API to generate professional note
      const response = await fetch('http://localhost:8000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ // AI generated
          ...session,
          style: noteStyle
        })       
      });
      
      const data = await response.json();
      setResult(data.professional_note);
      setEditableNote(data.professional_note);
    } catch (error) {
      setError("Failed to process notes");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Session Notes</h2>
      {/* Error message display */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Note style selector */}
      <select
        className="w-full p-2 rounded border"
        value={noteStyle}
        onChange={(e) => setNoteStyle(e.target.value)}>
          <option value="detailed">Detailed SOAP note</option>
          <option value="brief">Brief Summary</option>
          <option value="narrative">Narrative</option>
      </select>

      {/* Session input form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Duration input */}
          <input 
            type="number"
            placeholder="Duration (minutes)"
            className="p-2 rounded border"
            value={session.duration}
            onChange={(e) => setSession({...session, duration: e.target.value})}
          />
          {/* Session type selector */}
          <select 
            className="p-2 rounded border"
            value={session.type}
            onChange={(e) => setSession({...session, type: e.target.value})}
          >
            <option value="">Select Type</option>
            <option value="initial">Initial</option>
            <option value="followup">Follow-up</option>
          </select>
        </div>

        {/* Observations input */}
        <textarea
          placeholder="Enter session observations..."
          className="w-full h-40 p-2 rounded border"
          value={session.observations}
          onChange={(e) => setSession({...session, observations: e.target.value})}
        />

        {/* Submit button */}
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Generate Notes
        </button>
      </form>

      {/* Results display section , AI generated ternary operator*/}
      {loading ? (
        <p>Processing...</p>
      ) : result && (
        <>
          {/* Generated note display */}
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold mb-2">Professional Note:</h3>
            <p>{result}</p>
          </div>
          {/* Note editing section */}
          <div className="mt-4">
            <textarea
              className="w-full h-40 p-2 rounded border"
              value={editableNote}
              onChange={(e) => setEditableNote(e.target.value)}
              placeholder="Edit generated notes here..."
            />

            {/* Section regeneration buttons */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => regenerateSection('subjective')}
                className="bg-purple-500 text-white p-2 rounded text-sm">
                Regenerate Subjective
              </button>
              <button
                onClick={() => regenerateSection("objective")}
                className="bg-purple-500 text-white p-2 rounded text-sm">
                Regenerate Objective
              </button>
            </div>

            {/* Save button and status */}
            <button 
              className="mt-2 bg-green-500 text-white p-2 rounded"
              onClick={handleSave}
            >
              Save Changes
            </button>
            {saveStatus && <p className="mt-2 text-sm">{saveStatus}</p>}
          </div>
        </>
      )}
    </div>
  )
}