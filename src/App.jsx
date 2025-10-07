import {useEffect, useRef, useState} from "react";


function App() {
  const markers = [
    {
      id: 1,
      name: "Duel Among the Spider Lillies",
      x: 2273,
      y: 7608,
      image: "/duels/spider-lillies.jpg"
    },
    {
      id: 2,
      name: "Duel in the Drowning Marsh",
      x: 3019,
      y: 7868,
      image: "/duels/jay-lee-duel-in-the-drowning-marsh.jpg"
    },
    {
      id: 3,
      name: "Duel Under Falling Water",
      x: 1984,
      y: 5937,
      image: "/duels/jay-lee-duel-under-the-falling-water.jpg"
    },
    {
      id: 4,
      name: "Duel of Crashing Waves",
      x: 3445,
      y: 6074,
      image: "/duels/jay-lee-duel-of-crashing-waves.jpg"
    },
    {
      id: 5,
      name: "Duel Under Autumn Leaves",
      x: 3470,
      y: 4928,
      image: "/duels/ghost-of-tsushima-duel-under-falling-leaves.jpg"
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [scale, setScale] = useState(1);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const audioRef = useRef(null);
  const mapRef = useRef(null);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!dragStart) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setDragStart(null);

  const handleWheel = (e) => {
    e.preventDefault();

    const zoomSpeed = 0.0015;
    const newScale = Math.min(Math.max(0.1, scale - e.deltaY * zoomSpeed), 5);

    if (!mapRef.current) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Compute map-space coordinates (before zoom)
    // We must measure relative to the container, not the mapRef rect
    const container = mapRef.current.parentElement.getBoundingClientRect();
    const relX = mouseX - container.left - offset.x;
    const relY = mouseY - container.top - offset.y;

    const worldX = relX / scale;
    const worldY = relY / scale;

    // Compute new offset so the same world point stays under the cursor
    const newOffset = {
      x: mouseX - container.left - worldX * newScale,
      y: mouseY - container.top - worldY * newScale,
    };

    setOffset(newOffset);
    setScale(newScale);
  };


  useEffect(() => {
    const baseWidth = 5000;
    const baseHeight = 15000;

    // Fit to height
    const fitScale = window.innerHeight / baseHeight;

    // Add optional zoom factor (slightly in)
    const zoomFactor = 1.6;
    const scaledWidth = baseWidth * fitScale * zoomFactor;
    const scaledHeight = baseHeight * fitScale * zoomFactor;

    // Center horizontally and vertically (optional)
    const offsetX = (window.innerWidth - scaledWidth) / 2;
    const offsetY = (window.innerHeight - scaledHeight) / 2;

    setScale(fitScale * zoomFactor);
    setOffset({ x: offsetX, y: offsetY });
  }, []);


  document.body.addEventListener('click', e => {
    console.log(`X: ${e.offsetX}, Y: ${e.offsetY}`);
  });


  return (
    <>
      <div
        onWheel={handleWheel}
        style={{
          width: "100vw",
          height: "100vh",       // viewport height
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#E9E0C8"
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
        <div
          ref={mapRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "5000px",
            height: "15000px",
            cursor: dragStart ? "grabbing" : "grab",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: dragStart ? "none" : "transform 0.1s ease-out",
          }}
        >
          <img
            src="/tsushima.jpeg"
            alt="Tsushima Map"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "5000px",
              height: "15000px",
              pointerEvents: "none", // so dragging works smoothly
              userSelect: "none",
            }}
          />
          {markers.map((marker) => (
            <div
              key={marker.id}
              style={{
                position: "absolute",
                left: `${marker.x}px`,
                top: `${marker.y}px`,
                transform: "translate(-50%, -50%)", // center the marker
                cursor: "pointer",
                color: "red",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
              onClick={() => setSelectedMarker(marker)}
            >
              ●
            </div>
          ))}
        </div>
        {/* Marker Modal */}
        {selectedMarker && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3000,
            }}
            onClick={() => setSelectedMarker(null)}
          >
            <div
              style={{
                background: "#111",
                padding: "1rem",
                borderRadius: "12px",
                maxWidth: "80vw",
                maxHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ color: "white", marginBottom: "1rem" }}>
                {selectedMarker.name}
              </h2>
              <img
                src={selectedMarker.image}
                alt={selectedMarker.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  borderRadius: "8px",
                }}
              />
              <button
                onClick={() => setSelectedMarker(null)}
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
