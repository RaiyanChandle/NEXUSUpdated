import React, { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { PhoneOutgoing, PhoneMissed } from "lucide-react";

const HaveCall = () => {
  const [vapi, setVapi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const scrollRef = useRef(null);

  const apiKey = "f3b3765e-7b99-46fa-97c3-42cc7d88dbce";
  const assistantId = "998bf4f4-0ac9-443a-8a44-706766a1516a";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnected(true);
    });
    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });
    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });
    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });
    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role,
            text: message.transcript,
          },
        ]);
      }
    });
    vapiInstance.on("error", (error) => {
      console.error("Vapi error:", error);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, [apiKey]);

  const startCall = () => {
    if (vapi) vapi.start(assistantId);
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
      setTranscript([]);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "var(--wm-bg, #f8f9fa)",
        transition: "background 0.2s",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Chat Container */}
      {isConnected && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            background: 'rgba(0,0,0,0.12)',
          }}
        >
          <div
            className="rounded-xl shadow-lg flex flex-col items-center justify-between animate-fade-in"
            style={{
              width: 400,
              height: 450,
              background: "var(--wm-card, #fff)",
              padding: "1.5rem",
              border: "1px solid #e1e5e9",
              position: "relative",
            }}
          >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2">
              <div
                style={{
                  background: isSpeaking ? "#ff4444" : "#12A594",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  animation: isSpeaking ? "pulse 1.2s infinite" : undefined,
                }}
              ></div>
              <span
                className="font-bold text-[#222] dark:text-white text-base"
                style={{ userSelect: "none" }}
              >
                {isSpeaking ? "Assistant Speaking..." : "Listening..."}
              </span>
            </div>

            <button
              onClick={endCall}
              className="flex gap-2 items-center text-white rounded-md px-3 py-1.5 text-xs cursor-pointer"
              style={{
                background: "#ff4444",
                fontWeight: 600,
                border: "none",
              }}
            >
              <PhoneMissed size={16} />
              <span>End</span>
            </button>
          </div>

          {/* Chat Transcript */}
          <div
            ref={scrollRef}
            className="overflow-y-auto w-full mb-2 p-3 rounded-lg"
            style={{
              color: "var(--wm-chat-text, #222)",
              border: "1px solid #e1e5e9",
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {transcript.length === 0 ? (
              <p className="text-[#666] text-sm m-0 text-center">
                Conversation will appear here...
              </p>
            ) : (
              transcript.map((msg, i) => (
                <div
                  key={i}
                  className="mb-2 flex"
                  style={{
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <span
                    style={{
                      background:
                        msg.role === "user"
                          ? "#12A594"
                          : window.matchMedia &&
                            window.matchMedia("(prefers-color-scheme: dark)")
                              .matches
                          ? "#333"
                          : "#e6e6e6",
                      color:
                        msg.role === "user"
                          ? "#fff"
                          : window.matchMedia &&
                            window.matchMedia("(prefers-color-scheme: dark)")
                              .matches
                          ? "#fff"
                          : "#222",
                      padding: "10px 18px",
                      borderRadius: 18,
                      fontSize: 15,
                      fontWeight: 500,
                      maxWidth: "80%",
                      display: "inline-block",
                      boxShadow:
                        msg.role === "user"
                          ? "0 2px 8px rgba(18,165,148,0.10)"
                          : "0 2px 8px rgba(51,51,51,0.06)",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
          </div>
          </div>
        </div>
      )}

      {/* Floating Call Button */}
      {!isConnected && (
        <button
          className="flex gap-2 items-center font-semibold fixed bottom-6 right-6 shadow-lg"
          style={{
            background: "#12A594",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "14px 26px",
            fontSize: 17,
            boxShadow: "0 4px 16px rgba(18,165,148,0.2)",
            transition: "background 0.2s",
          }}
          onClick={startCall}
          onMouseOver={(e) => (e.currentTarget.style.background = "#0e7c6a")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#12A594")}
        >
          <PhoneOutgoing size={22} /> <span>Talk to Assistant</span>
        </button>
      )}

      {/* Pulse and fade animations */}
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255,68,68,0.15); }
            70% { box-shadow: 0 0 0 8px rgba(255,68,68,0.10); }
            100% { box-shadow: 0 0 0 0 rgba(255,68,68,0.15); }
          }

          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-in-out;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --wm-bg: #23272f;
              --wm-card: #2d323b;
              --wm-chat-text: #fff;
            }
          }

          @media (prefers-color-scheme: light) {
            :root {
              --wm-bg: #f8f9fa;
              --wm-card: #fff;
              --wm-chat-text: #222;
            }
          }
        `}
      </style>
    </div>
  );
};

export default HaveCall;
