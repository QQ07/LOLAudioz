import { useState } from "react";
import { storage, db } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Upload.css";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadAudio = async () => {
    if (!file) return alert("Select an audio file first! 🎵");
    if (!title.trim()) return alert("Add a title! 📝");

    setLoading(true);
    try {
      const audioRef = ref(storage, `audios/${Date.now()}-${file.name}`);
      await uploadBytes(audioRef, file);
      const audioUrl = await getDownloadURL(audioRef);

      await addDoc(collection(db, "audios"), {
        title: title.trim(),
        audioUrl,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        setFile(null);
        setTitle("");
        setSuccess(false);
      }, 2000);
    } catch (error) {
      alert("Upload failed! Try again 😢");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h1>🎤 Upload Your Audio</h1>
        <p className="upload-subtitle">
          Share your hilarious audio with the world
        </p>
      </div>

      <div className="upload-card">
        {success ? (
          <div className="success-message">
            <div className="success-icon">✨</div>
            <h3>Uploaded successfully! 🎉</h3>
            <p>Your audio is now live</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="title">Comedy Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g., huehuehue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                maxLength="60"
              />
              <span className="char-count">{title.length}/60</span>
            </div>

            <div
              className={`drag-drop ${dragActive ? "active" : ""} ${
                file ? "has-file" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="audio-input"
                accept="audio/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
                    alert("File size must be less than 2 MB!");
                    return;
                  }
                  setFile(selectedFile);
                }}
                disabled={loading}
              />
              <label htmlFor="audio-input" className="drop-label">
                {file ? (
                  <>
                    <div className="file-icon">🎵</div>
                    <p className="file-name">{file.name}</p>
                    <span className="file-size">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="upload-icon">📤</div>
                    <p>Drag your audio here or click to browse</p>
                    <span>MP3, WAV, M4A up to 2MB</span>
                  </>
                )}
              </label>
            </div>

            <button
              onClick={uploadAudio}
              disabled={loading || !file || !title.trim()}
              className="upload-btn"
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>🚀 Upload Now</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
