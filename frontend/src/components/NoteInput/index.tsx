"use client";

import { useState } from 'react'

export default function NoteInput() {
 const [session, setSession] = useState({
   duration: '',
   type: '',
   observations: ''
 })
 const [result, setResult] = useState("")
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState("")
 const [editableNote, setEditableNote] = useState("")
 const [saveStatus, setSaveStatus] = useState("")

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

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setError("");
   
   if (!session.duration || !session.type || !session.observations) {
     setError("All fields required");
     return;
   }
   
   setLoading(true);
   try {
     const response = await fetch('http://localhost:8000/api/notes', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(session)
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
     {error && <div className="text-red-500 mb-4">{error}</div>}
     <form onSubmit={handleSubmit} className="space-y-4">
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
           onChange={(e) => setSession({...session, type: e.target.value})}
         >
           <option value="">Select Type</option>
           <option value="initial">Initial</option>
           <option value="followup">Follow-up</option>
         </select>
       </div>

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

     {loading ? (
       <p>Processing...</p>
     ) : result && (
       <>
         <div className="mt-4 p-4 border rounded">
           <h3 className="font-bold mb-2">Professional Note:</h3>
           <p>{result}</p>
         </div>
         <div className="mt-4">
           <textarea
             className="w-full h-40 p-2 rounded border"
             value={editableNote}
             onChange={(e) => setEditableNote(e.target.value)}
             placeholder="Edit generated notes here..."
           />
           <button 
             className="mt-2 bg-green-500 text-white p-2 rounded"
             onClick={handleSave}
           >
             Save Changes
           </button>
           {saveStatus && <p className = "mt-2 text-sm">{saveStatus}</p>}
         </div>
       </>
     )}
   </div>
 )
}