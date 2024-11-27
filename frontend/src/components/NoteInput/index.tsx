/*React component that allows users to input session notes. Form has sections - session parameters, observations, and submit button*/

// src/components/NoteInput/index.tsx
"use client";
import { useState } from 'react'

export default function NoteInput() {
  const [session, setSession] = useState({
    duration: '',
    type: '',
    observations: ''
  })

  /* Adding response display */

  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  /* Adding the API call to the note input component */

  const handleSubmit = async (e: React.FormEvent) => {
    /* Preventing default form behavior (page reload) */
    e.preventDefault();
    setLoading(true);

    /* Sending a POST request */
    try {
      const response = await fetch('http://localhost:8000/api/notes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(session)
      });

      /* Handling response */
      const data = await response.json();
      setResult(data.professional_note);

    } catch(error) {
      console.error(error);
    }

    setLoading(false);
  };


  return (
    /* Sets max width and height */

    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Please add the session notes</h2>
      <form className="space-y-4" onSubmit = {handleSubmit}>
        {/* Session parameters */}
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number"
            placeholder="Duration (minutes)"
            className="p-2 rounded border"
            value={session.duration}
            onChange={(e) => setSession({...session, duration: e.target.value})}
          />
          <select 
            className="p-2 rounded border"
            value={session.type}
            /* Updates session state*/
            onChange={(e) => setSession({...session, type: e.target.value})}
          >
            <option value="">Select Type</option>
            <option value="initial">Initial</option>
            <option value="followup">Follow-up</option>
          </select>
        </div>



        {/* Observations */}
        <textarea
          placeholder="Enter session observations..."
          className="w-full h-40 p-2 rounded border"
          value={session.observations}
          onChange={(e) => setSession({...session, observations: e.target.value})}
        />

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Generate Notes
        </button>
      </form>

      {loading ? (        /*Ternary operator, if loading is true then it renders the result as a professional note*/
        <p>Processing...</p>
      ): result && (
        <div className = "mt-4 p-4 border rounded">
          <h3 className = "font-bold mb-2">Professional Note:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}