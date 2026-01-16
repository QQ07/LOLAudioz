import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "../services/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import AudioPlayer from "../components/AudioPlayer";
import "./Home.css";

export default function Home() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const q = query(collection(db, "audios"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAudios(list);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, []);

  return (
    <div className="home-container">
      <div className="header">
        <h1>🎭 LOL Audio</h1>
        <p className="subtitle">Your daily dose of laughs</p>
        <button className="upload-button" onClick={() => navigate("/upload")}>
          ➕ Upload Audio
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading vibes...</p>
        </div>
      ) : audios.length === 0 ? (
        <div className="empty-state">
          <p>No audios yet. Check back soon! 🎙️</p>
        </div>
      ) : (
        <div className="audios-grid">
          {audios.map((audio) => {
            console.log(audio);
            return (
              <div key={audio.id} className="audio-card">
                <div className="card-header">
                  <h3>{audio.title}</h3>
                </div>
                <div className="player-wrapper">
                  <AudioPlayer src={audio.audioUrl} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
