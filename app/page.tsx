'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  description: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  // Load saved notes from LocalStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to LocalStorage when notes array changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Check for duplicate titles
  useEffect(() => {
    const existingNote = notes.find(
      (note) => note.title.toLowerCase() === title.toLowerCase() && note.id !== editId
    );

    if (existingNote && title.trim() !== '') {
      setMessage('A note with this title already exists.');
    } else {
      setMessage('');
    }
  }, [title, notes, editId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '' || description.trim() === '') {
      alert('Please enter a title and description.');
      return;
    }

    if (message !== '') {
      alert('This note title already exists.');
      return;
    }

    if (editId !== null) {
      // Update Note
      setNotes(
        notes.map((note) =>
          note.id === editId ? { ...note, title, description } : note
        )
      );
      setEditId(null);
    } else {
      // Add New Note
      const newNote: Note = {
        id: Date.now(),
        title,
        description,
      };
      setNotes([...notes, newNote]);
    }

    setTitle('');
    setDescription('');
  };

  const handleDelete = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEdit = (id: number) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setTitle(note.title);
      setDescription(note.description);
      setEditId(note.id);
    }
  };

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>My Notes</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />

        {message && <p style={{ color: 'red', margin: 0 }}>{message}</p>}

        <textarea
          placeholder="Note Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', minHeight: '100px' }}
        />

        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          {editId !== null ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {notes.length === 0 ? (
          <p>No notes available. Add one above!</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              style={{
                border: '1px solid #ccc',
                padding: '15px',
                borderRadius: '8px',
              }}
            >
              <h3>{note.title}</h3>
              <p>{note.description}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => handleEdit(note.id)}>Edit</button>
                <button onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}