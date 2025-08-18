import { useState, useEffect } from "react";

const messages = [
  "Restarting Server...",
  "Loading Application...",
  "Fetching Data...",
  "Almost Ready..."
];

export default function LoadingScreen() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < messages[currentMessage].length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + messages[currentMessage][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentMessage]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(90deg, #000000, #9929ea, #000000)",
        fontFamily: "monospace"
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "2rem",
          borderRight: "2px solid white",
          paddingRight: "8px",
          whiteSpace: "nowrap",
          overflow: "hidden"
        }}
      >
        {displayedText}
      </h1>
    </div>
  );
}
