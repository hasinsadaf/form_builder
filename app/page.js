"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [fields, setFields] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [editField, setEditField] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("form_builder");
    if (saved) setFields(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("form_builder", JSON.stringify(fields));
  }, [fields]);

  const addField = (type) => {
    setFields([
      ...fields,
      {
        id: Date.now(),
        type,
        label: `${type} field`,
        placeholder: "",
        required: false
      }
    ]);
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (index) => {
    if (index === dragIndex) return;

    const updated = [...fields];
    const draggedItem = updated[dragIndex];

    updated.splice(dragIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDragIndex(index);
    setFields(updated);
  };

  const deleteField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const saveEdit = () => {
    setFields(fields.map((f) => (f.id === editField.id ? editField : f)));
    setEditField(null);
  };

  return (
    <div className="p-8 grid grid-cols-2 gap-10">

      <div>
        <h1 className="text-2xl font-bold mb-4">Form Builder</h1>

        <div className="flex gap-3 mb-4">
          <button onClick={() => addField("text")} className="bg-gray-400 w-30 text-black rounded-2xl">Add Text</button>
          <button onClick={() => addField("email")} className="bg-gray-400 w-30 text-black rounded-2xl">Add Email</button>
          <button onClick={() => addField("number")} className="bg-gray-400 w-30 text-black rounded-2xl">Add Number</button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={() => handleDragOver(index)}
            className="border p-3 rounded-2xl mb-3 bg-gray-400 text-black cursor-move"
          >
            <div className="flex justify-between">
              <strong>{field.label}</strong>
              <div className="flex gap-2">
                <button onClick={() => setEditField(field)}>Edit</button>
                <button onClick={() => deleteField(field.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </div>
            <small>{field.type}</small>
          </div>
        ))}

        {editField && (
          <div className="fixed right-5 top-5 bg-gray-400 p-5 border rounded shadow w-64">
            <h2 className="font-bold text-black mb-3">Edit Field</h2>

            <label className="block text-black mb-1">Label:</label>
            <input
              className="border text-black p-1 w-full mb-3"
              value={editField.label}
              onChange={(e) =>
                setEditField({ ...editField, label: e.target.value })
              }
            />

            <label className="block text-black mb-1">Placeholder:</label>
            <input
              className="border text-black p-1 w-full mb-3"
              value={editField.placeholder}
              onChange={(e) =>
                setEditField({ ...editField, placeholder: e.target.value })
              }
            />

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={editField.required}
                onChange={(e) =>
                  setEditField({ ...editField, required: e.target.checked })
                }
              />
              Required?
            </label>

            <button onClick={saveEdit} className="mr-2 text-green-800">
              Save
            </button>
            <button onClick={() => setEditField(null)} className="text-red-600">Cancel</button>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Live Preview</h1>

        <form className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block font-semibold">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
        </form>
      </div>

    </div>
  );
}
