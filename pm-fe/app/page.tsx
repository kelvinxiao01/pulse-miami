"use client";

import { useState, useRef, useEffect } from "react";
import {
  RoomAudioRenderer,
  useSession,
  SessionProvider,
  useAgent,
  BarVisualizer,
  useSessionMessages,
} from "@livekit/components-react";
import { TokenSource } from "livekit-client";
import "@livekit/components-styles";

const clouds = [
  { id: 1, top: "8%", left: "5%", size: 120, delay: 0, speed: 60 },
  { id: 2, top: "20%", left: "70%", size: 160, delay: -15, speed: 80 },
  { id: 3, top: "55%", left: "60%", size: 140, delay: -30, speed: 70 },
  { id: 4, top: "75%", left: "-5%", size: 180, delay: -10, speed: 90 },
  { id: 5, top: "35%", left: "40%", size: 100, delay: -45, speed: 65 },
];

function Cloud({ top, left, size, delay, speed }: any) {
  return (
    <div style={{ position: "absolute", top, left, width: size, animation: `drift ${speed}s linear ${delay}s infinite`, opacity: 0.92, filter: "drop-shadow(0 4px 16px rgba(180,210,240,0.4))" }}>
      <svg viewBox="0 0 200 120" fill="none">
        <ellipse cx="100" cy="90" rx="90" ry="35" fill="white" />
        <ellipse cx="70" cy="75" rx="50" ry="40" fill="white" />
        <ellipse cx="120" cy="70" rx="55" ry="42" fill="white" />
        <ellipse cx="90" cy="58" rx="38" ry="32" fill="white" />
        <ellipse cx="130" cy="62" rx="32" ry="26" fill="white" />
      </svg>
    </div>
  );
}

const faces = [
  { label: "Great", bg: "#f5a623", renderFace: () => (<><path d="M 30 37 Q 37 30 44 37" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" /><path d="M 56 37 Q 63 30 70 37" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" /><path d="M 22 57 Q 50 84 78 57" fill="none" stroke="#333" strokeWidth="3.5" strokeLinecap="round" /></>) },
  { label: "Good",  bg: "#f0d000", renderFace: () => (<><circle cx="37" cy="40" r="5" fill="#333" /><circle cx="63" cy="40" r="5" fill="#333" /><path d="M 28 58 Q 50 76 72 58" fill="none" stroke="#333" strokeWidth="3.5" strokeLinecap="round" /></>) },
  { label: "Okay",  bg: "#3ecf4c", renderFace: () => (<><circle cx="37" cy="42" r="5" fill="#333" /><circle cx="63" cy="42" r="5" fill="#333" /><line x1="32" y1="63" x2="68" y2="63" stroke="#333" strokeWidth="3.5" strokeLinecap="round" /></>) },
  { label: "Bad",   bg: "#29c4c4", renderFace: () => (<><circle cx="37" cy="42" r="5" fill="#333" /><circle cx="63" cy="42" r="5" fill="#333" /><path d="M 30 70 Q 50 56 70 70" fill="none" stroke="#333" strokeWidth="3.5" strokeLinecap="round" /></>) },
  { label: "Awful", bg: "#3b6fd4", renderFace: () => (<><path d="M 30 40 Q 37 47 44 40" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" /><path d="M 56 40 Q 63 47 70 40" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" /><path d="M 22 74 Q 50 54 78 74" fill="none" stroke="#333" strokeWidth="3.5" strokeLinecap="round" /></>) },
];

function FaceIcon({ bg, renderFace, size = 88, onClick }: any) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
      style={{ cursor: onClick ? "pointer" : "default", transition: "transform 0.2s" }}
      onClick={onClick}>
      <circle cx="50" cy="50" r="46" fill={bg} />
      {renderFace()}
    </svg>
  );
}

function getStateLabel(state: string): string {
  switch (state) {
    case "connecting":
    case "initializing":
      return "Connecting...";
    case "listening":
      return "Listening...";
    case "thinking":
      return "Thinking...";
    case "speaking":
      return "Speaking...";
    default:
      return "Starting...";
  }
}

function VoiceScreen({ onDisconnect }: { onDisconnect: () => void }) {
  const agent = useAgent();
  const { messages } = useSessionMessages();
  const [correctFlash, setCorrectFlash] = useState(false);
  const prevMessageCount = useRef(0);

  useEffect(() => {
    if (messages.length <= prevMessageCount.current) {
      prevMessageCount.current = messages.length;
      return;
    }
    const newMessages = messages.slice(prevMessageCount.current);
    prevMessageCount.current = messages.length;

    const hasCorrect = newMessages.some(
      (m) => m.type === "agentTranscript" && /\bcorrect\b/i.test(m.message)
    );
    if (hasCorrect) {
      setCorrectFlash(true);
      setTimeout(() => setCorrectFlash(false), 1500);
    }
  }, [messages]);

  const borderColor = correctFlash ? "#4ade80" : "rgba(255,255,255,0.4)";
  const glowStyle = correctFlash
    ? "0 0 40px rgba(74, 222, 128, 0.5)"
    : agent.state === "speaking"
      ? "0 0 40px rgba(255,255,255,0.2)"
      : "none";

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", textAlign: "center", padding: "0 24px",
      animation: "fadeIn 0.6s ease both", position: "relative", zIndex: 5,
    }}>
      <p style={{
        color: "white", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 800,
        margin: "0 0 48px", fontFamily: "'Arial Black', sans-serif", opacity: 0.9,
      }}>
        {getStateLabel(agent.state)}
      </p>
      <div style={{
        background: agent.state === "speaking"
          ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
        border: `2px solid ${borderColor}`,
        borderRadius: 28, padding: "32px 40px",
        transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
        boxShadow: glowStyle,
        height: 184, display: "flex", alignItems: "center",
      }}>
        {agent.microphoneTrack && (
          <BarVisualizer trackRef={agent.microphoneTrack} state={agent.state} barCount={30} />
        )}
      </div>
      <RoomAudioRenderer />
      <span onClick={onDisconnect} style={{
        color: "white", fontWeight: 800, fontSize: 22, cursor: "pointer",
        fontFamily: "'Arial Black', sans-serif", letterSpacing: 1, marginTop: 32,
      }}>End</span>
    </div>
  );
}

export default function Cloud9() {
  const [screen, setScreen] = useState<"home" | "mood" | "confirm" | "menu" | "voice">("home");
  const [selected, setSelected] = useState<number | null>(null);
  const [activity, setActivity] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const moodRef = useRef<string>("");
  const activityRef = useRef<string>("");

  const tokenSource = useRef(
    TokenSource.custom(async (options) => {
      const res = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_name: options.roomName,
          participant_identity: options.participantIdentity,
          mood: moodRef.current,
          activity: activityRef.current,
        }),
      });
      return res.json();
    })
  ).current;

  const session = useSession(tokenSource, { agentName: "my-agent" });

  const handleConnect = (item: string) => {
    const mood = selected !== null ? faces[selected].label : "";
    moodRef.current = mood;
    activityRef.current = item;
    setActivity(item);
    session.start();
    setStarted(true);
    setScreen("voice");
  };

  const handleDisconnect = () => {
    session.end();
    setStarted(false);
    setScreen("home");
  };

  const menuItems = ["Memory", "Reflection", "Relax"];

  const selectedFace = selected !== null ? faces[selected] : null;

  return (
    <SessionProvider session={session}>
    <div style={{ fontFamily: "'Segoe UI', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @keyframes drift { from { transform: translateX(-250px); } to { transform: translateX(110vw); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        .cta-btn { transition: all 0.2s; }
        .cta-btn:hover { transform: scale(1.04); }
        .face-hover:hover { transform: scale(1.1); transition: transform 0.2s; }
        .lk-audio-bar-visualizer { --lk-va-bar-bg: rgba(255,255,255,0.3); --lk-fg: white; --lk-bg: transparent; gap: 5px; }
      `}</style>

      <section style={{ position: "relative", height: "100vh", background: "linear-gradient(180deg, #5ba3c9 0%, #7dbfe0 30%, #a8d8ea 60%, #cde8f0 80%, #dde9ee 100%)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 40% at 60% 30%, rgba(255,200,180,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        {clouds.map(c => <Cloud key={c.id} {...c} />)}

        <nav style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px" }}>
          <span style={{ color: "white", fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>☁ CLOUD9</span>
        </nav>

        {/* HOME */}
        {screen === "home" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", animation: "fadeUp 1s ease both", position: "relative", zIndex: 5 }}>
            <h1 style={{ color: "white", fontSize: "clamp(52px, 10vw, 96px)", fontWeight: 900, letterSpacing: "-2px", textShadow: "0 4px 24px rgba(60,100,140,0.25)", margin: "0 0 40px", fontFamily: "'Arial Black', sans-serif" }}>CLOUD9</h1>
            <a className="cta-btn" onClick={() => setScreen("mood")} style={{ background: "white", color: "#5ba3c9", border: "none", borderRadius: 30, padding: "14px 36px", fontWeight: 800, fontSize: 15, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>Begin</a>
          </div>
        )}

        {/* MOOD PICKER */}
        {screen === "mood" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", animation: "fadeIn 0.6s ease both", position: "relative", zIndex: 5 }}>
            <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 32 }}>
              {faces.map((f, i) => (
                <div key={f.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div className="face-hover" onClick={() => { setSelected(i); setScreen("confirm"); }}>
                    <FaceIcon bg={f.bg} renderFace={f.renderFace} size={88} />
                  </div>
                  <span style={{ color: "white", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Arial Black', sans-serif" }}>{f.label}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "white", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, margin: "0 0 48px", lineHeight: 1.3, fontFamily: "'Arial Black', sans-serif" }}>How are you feeling today?</p>
            <span onClick={() => setScreen("menu")} style={{ color: "white", fontWeight: 800, fontSize: 22, cursor: "pointer", fontFamily: "'Arial Black', sans-serif", letterSpacing: 1 }}>skip</span>
          </div>
        )}

        {/* CONFIRM */}
        {screen === "confirm" && selectedFace && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", animation: "fadeIn 0.5s ease both", position: "relative", zIndex: 5 }}>
            <div style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both", marginBottom: 36 }}>
              <FaceIcon bg={selectedFace.bg} renderFace={selectedFace.renderFace} size={200} />
            </div>
            <p style={{ color: "white", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, margin: "0 0 40px", lineHeight: 1.4, fontFamily: "'Arial Black', sans-serif" }}>
              You are feeling {selectedFace.label.toLowerCase()}.<br />Is this correct?
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <button className="cta-btn" onClick={() => setScreen("mood")} style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.7)", color: "white", borderRadius: 30, padding: "18px 56px", fontWeight: 800, fontSize: 20, cursor: "pointer" }}>No</button>
              <button className="cta-btn" onClick={() => setScreen("menu")} style={{ background: "white", color: "#5ba3c9", border: "none", borderRadius: 30, padding: "18px 56px", fontWeight: 800, fontSize: 20, cursor: "pointer", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>Yes</button>
            </div>
          </div>
        )}

        {/* MENU */}
        {screen === "menu" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 28, padding: "0 40px", animation: "fadeIn 0.6s ease both", position: "relative", zIndex: 5 }}>
            {menuItems.map(item => (
              <div key={item} onClick={() => handleConnect(item)} style={{
                width: "100%", maxWidth: 360,
                background: "rgba(100,140,170,0.55)",
                borderRadius: 20,
                padding: "22px 32px",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
                boxShadow: "0 4px 24px rgba(60,100,140,0.18)",
                transition: "transform 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <span style={{ color: "white", fontWeight: 900, fontSize: 30, fontFamily: "'Arial Black', sans-serif", letterSpacing: 0.5 }}>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* VOICE */}
        {screen === "voice" && started && (
          <VoiceScreen onDisconnect={handleDisconnect} />
        )}
      </section>
    </div>
    </SessionProvider>
  );
}
