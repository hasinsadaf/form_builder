"use client";

import { useState, useEffect } from "react";
import { Upload, Type, Mail, Hash, Image, File, GripVertical, Edit2, Trash2 } from "lucide-react";

export default function Page() {
  const [fields, setFields] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [editField, setEditField] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("form_builder");
    if (saved) setFields(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("form_builder", JSON.stringify(fields));
  }, [fields]);

  const addField = (type) => {
    const fieldLabels = {
      text: "Text Input",
      email: "Email Address",
      number: "Number",
      image: "Image Upload",
      file: "File Upload"
    };
    
    setFields([
      ...fields,
      {
        id: Date.now(),
        type,
        label: fieldLabels[type] || `${type} field`,
        placeholder: type === "image" || type === "file" ? "" : "Enter value...",
        required: false,
        accept: type === "image" ? "image/*" : type === "file" ? "*/*" : ""
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

  const getFieldIcon = (type) => {
    switch(type) {
      case "text": return <Type className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "number": return <Hash className="w-4 h-4" />;
      case "image": return <Image className="w-4 h-4" />;
      case "file": return <File className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        
        {/* Builder Panel */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Form Builder</h1>
            <p className="text-slate-400 text-sm">Drag fields to reorder, click to edit</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <button 
              onClick={() => addField("text")} 
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/30"
            >
              <Type className="w-4 h-4" />
              Text
            </button>
            <button 
              onClick={() => addField("email")} 
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/30"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button 
              onClick={() => addField("number")} 
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/30"
            >
              <Hash className="w-4 h-4" />
              Number
            </button>
            <button 
              onClick={() => addField("image")} 
              className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-pink-900/30"
            >
              <Image className="w-4 h-4" />
              Image
            </button>
            <button 
              onClick={() => addField("file")} 
              className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-orange-900/30"
            >
              <Upload className="w-4 h-4" />
              File
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {fields.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Type className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No fields yet. Add a field to get started.</p>
              </div>
            )}
            
            {fields.map((field, index) => (
              <div
                key={field.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOver(index)}
                className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 cursor-move hover:border-slate-500 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <GripVertical className="w-5 h-5 text-slate-400 mt-0.5 group-hover:text-slate-300" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getFieldIcon(field.type)}
                        <span className="font-semibold text-white">{field.label}</span>
                        {field.required && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Required</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 capitalize">{field.type} field</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditField(field)}
                      className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
                      title="Edit field"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteField(field.id)} 
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-300 hover:text-red-400"
                      title="Delete field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editField && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Field</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Label</label>
                    <input
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editField.label}
                      onChange={(e) =>
                        setEditField({ ...editField, label: e.target.value })
                      }
                    />
                  </div>

                  {editField.type !== "image" && editField.type !== "file" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Placeholder</label>
                      <input
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editField.placeholder}
                        onChange={(e) =>
                          setEditField({ ...editField, placeholder: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {(editField.type === "image" || editField.type === "file") && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Accepted file types</label>
                      <input
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editField.accept || ""}
                        placeholder={editField.type === "image" ? "image/*" : "*/*"}
                        onChange={(e) =>
                          setEditField({ ...editField, accept: e.target.value })
                        }
                      />
                      <p className="text-xs text-slate-400 mt-1">e.g., image/*, .pdf, .docx</p>
                    </div>
                  )}

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editField.required}
                      onChange={(e) =>
                        setEditField({ ...editField, required: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-slate-300">Required field</span>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={saveEdit} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setEditField(null)} 
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 lg:sticky lg:top-6 h-fit">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Live Preview</h2>
            <p className="text-slate-600 text-sm">See how your form will look</p>
          </div>

          <div className="space-y-5">
            {fields.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p>Your form preview will appear here</p>
              </div>
            )}
            
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {(field.type === "image" || field.type === "file") ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept={field.accept || (field.type === "image" ? "image/*" : "*/*")}
                      required={field.required}
                      className="hidden"
                      id={`file-${field.id}`}
                    />
                    <label htmlFor={`file-${field.id}`} className="cursor-pointer">
                      {field.type === "image" ? (
                        <Image className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      ) : (
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      )}
                      <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {field.accept || (field.type === "image" ? "Images only" : "Any file type")}
                      </p>
                    </label>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
            
            {fields.length > 0 && (
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
              >
                Submit Form
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}