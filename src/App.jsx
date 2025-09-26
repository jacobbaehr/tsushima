import {useRef, useState} from "react";


function App() {
  const markers = [
    {
      id: 1,
      name: "Komoda Beach",
      top: "20%",
      left: "40%",
    },
    {
      id: 2,
      name: "Golden Temple",
      top: "45%",
      left: "55%",
    },
    {
      id: 3,
      name: "Castle Kaneda",
      top: "70%",
      left: "30%",
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",       // viewport height
          overflowY: "scroll",   // enable scrolling
        }}
      >
        {/* Background Music (hidden player) */}
        <audio ref={audioRef} loop>
          <source src="/music/20 - Tsushima Suite_ III. Bushido.mp3" type="audio/mpeg" />
        </audio>

        <button
          onClick={() => setIsMenuOpen(true)}
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            backgroundColor: "rgba(0,0,0,0.2)", // translucent black
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "3rem",
            zIndex: 1000,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "black",
                borderRadius: "50%",
              }}
            ></div>
          ))}
        </button>
        {/* Modal */}
        {isMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
            onClick={() => setIsMenuOpen(false)} // click outside closes modal
          >
            <div
              style={{
                background: "#222",
                padding: "2rem",
                borderRadius: "8px",
                minWidth: "300px",
                color: "white",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
            >
              <h2 style={{ marginTop: 0 }}>Menu</h2>

              {/* Music Toggle */}
              <button
                onClick={toggleMusic}
                style={{
                  fontSize: "1rem",
                  background: "transparent",
                  border: "1px solid grey",
                  borderRadius: "4px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  color: isPlaying ? "white" : "grey",
                  textDecoration: isPlaying ? "none" : "line-through",
                }}
              >
                🎵 Background Music
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div style={{ position: "relative"}}>
          <img
            src="/tsushima.jpeg"
            alt="Tsushima Map"
            style={{
              margin: "0 auto",
              width: "100%",
              height: "auto",
            }}
          />
          {markers.map((marker) => (
            <div
              key={marker.id}
              style={{
                position: "absolute",
                top: marker.top,
                left: marker.left,
                transform: "translate(-50%, -50%)", // center the marker
                cursor: "pointer",
                color: "red",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
              onClick={() => alert(marker.name)}
            >
              ●
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
