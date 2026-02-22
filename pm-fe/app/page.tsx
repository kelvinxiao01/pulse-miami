"use client";

import { useState, useEffect } from "react";

const clouds = [
  { id: 1, top: "8%", left: "5%", size: 120, delay: 0, speed: 60 },
  { id: 2, top: "20%", left: "70%", size: 160, delay: -15, speed: 80 },
  { id: 3, top: "55%", left: "60%", size: 140, delay: -30, speed: 70 },
  { id: 4, top: "75%", left: "-5%", size: 180, delay: -10, speed: 90 },
  { id: 5, top: "35%", left: "40%", size: 100, delay: -45, speed: 65 },
];

function Cloud({ top, left, size, delay, speed }: { top: string; left: string; size: number; delay: number; speed: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        animation: `drift ${speed}s linear ${delay}s infinite`,
        opacity: 0.92,
        filter: "drop-shadow(0 4px 16px rgba(180,210,240,0.4))",
      }}
    >
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="90" rx="90" ry="35" fill="white" />
        <ellipse cx="70" cy="75" rx="50" ry="40" fill="white" />
        <ellipse cx="120" cy="70" rx="55" ry="42" fill="white" />
        <ellipse cx="90" cy="58" rx="38" ry="32" fill="white" />
        <ellipse cx="130" cy="62" rx="32" ry="26" fill="white" />
        {/* subtle inner lines */}
        <ellipse cx="80" cy="72" rx="28" ry="12" fill="none" stroke="#e0eaf5" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="120" cy="78" rx="32" ry="10" fill="none" stroke="#e0eaf5" strokeWidth="1.5" opacity="0.5" />
      </svg>
    </div>
  );
}

export default function Cloud9() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @keyframes drift {
          from { transform: translateX(-250px); }
          to { transform: translateX(110vw); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          opacity: 0.85;
          transition: opacity 0.2s;
          cursor: pointer;
        }
        .nav-link:hover { opacity: 1; }
        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(100,160,200,0.25) !important;
        }
        .cta-btn:hover {
          background: rgba(255,255,255,0.25) !important;
          transform: scale(1.04);
        }
        .cta-btn { transition: all 0.2s; }
        .card { transition: transform 0.3s, box-shadow 0.3s; }
      `}</style>

      {/* Hero */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #5ba3c9 0%, #7dbfe0 30%, #a8d8ea 60%, #cde8f0 80%, #dde9ee 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Painted cloud layer */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 40% at 60% 30%, rgba(255,200,180,0.25) 0%, transparent 70%), radial-gradient(ellipse 60% 30% at 20% 50%, rgba(255,255,255,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {clouds.map(c => <Cloud key={c.id} {...c} />)}

        {/* Nav */}
        <nav style={{
          position: "relative", zIndex: 10,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 48px",
        }}>
          <span style={{ color: "white", fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>☁ CLOUD9</span>
          <div style={{ display: "flex", gap: 36 }}>
            {["Home", "About", "Services", "Contact"].map(l => (
              <a key={l} className="nav-link">{l}</a>
            ))}
          </div>
          <button className="cta-btn" style={{
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.7)",
            color: "white", borderRadius: 30, padding: "8px 24px",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Get Started</button>
        </nav>

        {/* Hero Text */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          textAlign: "center", padding: "0 24px",
          animation: "fadeUp 1s ease both",
          position: "relative", zIndex: 5,
        }}>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", marginBottom: 16 }}>
            Welcome to
          </p>
          <h1 style={{
            color: "white",
            fontSize: "clamp(52px, 10vw, 96px)",
            fontWeight: 900,
            letterSpacing: "-2px",
            textShadow: "0 4px 24px rgba(60,100,140,0.25)",
            margin: "0 0 20px",
            fontFamily: "'Arial Black', sans-serif",
          }}>
            CLOUD9
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, maxWidth: 480, lineHeight: 1.7, marginBottom: 40 }}>
            Elevate your experience to the ninth cloud. We bring clarity, calm, and creativity to everything we do.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <button className="cta-btn" style={{
              background: "white", color: "#5ba3c9",
              border: "none", borderRadius: 30, padding: "14px 36px",
              fontWeight: 800, fontSize: 15, cursor: "pointer",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}>Explore Now</button>
            <button className="cta-btn" style={{
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.6)",
              color: "white", borderRadius: 30, padding: "14px 36px",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
            }}>Learn More</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ textAlign: "center", paddingBottom: 32, color: "rgba(255,255,255,0.6)", fontSize: 13, zIndex: 5 }}>
          ↓ scroll to explore
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "#f0f8fc", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ textAlign: "center", color: "#7dbfe0", fontWeight: 700, letterSpacing: 3, fontSize: 12, textTransform: "uppercase", marginBottom: 12 }}>What We Offer</p>
          <h2 style={{ textAlign: "center", fontSize: 40, fontWeight: 900, color: "#2d6a8a", marginBottom: 64 }}>
            Life&apos;s better up here
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {[
              { icon: "🌤", title: "Crystal Clarity", desc: "We cut through the noise and deliver clear, beautiful solutions that just work." },
              { icon: "✨", title: "Pure Elevation", desc: "Every product we craft is designed to lift you higher — in performance and spirit." },
              { icon: "🌊", title: "Effortless Flow", desc: "Seamless experiences that feel as natural as a breeze on a clear day." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{
                background: "white", borderRadius: 24, padding: "40px 32px",
                boxShadow: "0 8px 32px rgba(100,160,200,0.12)",
              }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#2d6a8a", marginBottom: 12 }}>{title}</h3>
                <p style={{ color: "#7a9eb5", lineHeight: 1.7, fontSize: 15 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: "linear-gradient(135deg, #5ba3c9, #a8d8ea)",
        padding: "80px 48px", textAlign: "center",
      }}>
        <h2 style={{ color: "white", fontSize: 40, fontWeight: 900, marginBottom: 16 }}>
          Ready to reach Cloud9?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, marginBottom: 36 }}>
          Join thousands of dreamers already living on top of the world.
        </p>
        <button className="cta-btn" style={{
          background: "white", color: "#5ba3c9",
          border: "none", borderRadius: 30, padding: "16px 48px",
          fontWeight: 800, fontSize: 16, cursor: "pointer",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        }}>Join Us Today</button>
      </section>

      {/* Footer */}
      <footer style={{ background: "#2d6a8a", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 18 }}>☁ CLOUD9</span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>© 2026 Cloud9. All rights reserved.</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13, cursor: "pointer" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
