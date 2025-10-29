import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";

const GEMINI_API_KEY = "AIzaSyDfu1MaBpTEvoXhYrJu4OY7neE5cNS_T5c";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const MarkdownText = ({ text }) => {
  const parseMarkdown = (text) => {
    let html = text;
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, l, c) => {
      return `<pre class="bg-slate-900/50 p-3 rounded-lg my-2 overflow-x-auto border border-purple-500/20"><code class="text-sm text-purple-300">${c.trim()}</code></pre>`;
    });
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-900/50 px-2 py-1 rounded text-purple-300 text-sm">$1</code>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-purple-200">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="font-bold text-purple-200">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="italic text-purple-200">$1</em>');
    html = html.replace(/_(.+?)_/g, '<em class="italic text-purple-200">$1</em>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-purple-300">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2 text-purple-300">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-purple-300">$1</h1>');
    html = html.replace(/^\* (.+)$/gm, '<li class="ml-6 list-disc my-1">$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li class="ml-6 list-disc my-1">$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal my-1">$1</li>');
    html = html.replace(/\n\n/g, "<br/><br/>");
    html = html.replace(/\n/g, "<br/>");
    html = html.replace(/^---$/gm, '<hr class="my-4 border-purple-500/30"/>');
    return html;
  };

  return <div dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} />;
};

const GeminiChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }],
        }),
      });
      const data = await res.json();
      let aiText = "";
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
      } else {
        aiText = "I couldn't generate a response. Please try again.";
      }
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error occurred. Please try again." },
      ]);
    }
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center">
      <div className="w-full h-full max-w-4xl flex flex-col p-2 sm:p-4">
        {/* Header */}
        <div className="text-center mb-3 shrink-0">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              NEXUS AI
            </h1>
          </div>
          <p className="text-purple-300 text-sm sm:text-base">
            Your intelligent conversation partner
          </p>
        </div>

        {/* Chat Box */}
        <div className="flex-1 flex flex-col bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl overflow-hidden">
          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#a855f7 #1e293b",
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="w-16 h-16 text-purple-400 mb-4 opacity-50" />
                <p className="text-purple-300 text-lg mb-2">
                  Start a conversation with NEXUS AI
                </p>
                <p className="text-slate-400 text-sm">
                  Ask me anything, I'm here to help!
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm"
                        : "bg-slate-700/50 text-slate-100 rounded-bl-sm border border-purple-500/20"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap break-words leading-relaxed">
                        {msg.text}
                      </p>
                    ) : (
                      <MarkdownText text={msg.text} />
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-700/50 px-4 py-3 rounded-2xl border border-purple-500/20">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-purple-500/20 bg-slate-800/80 p-3 sm:p-4 shrink-0">
            <div className="flex gap-2 w-full">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={loading}
                className="flex-1 bg-slate-700/50 text-white placeholder-slate-400 rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/20 disabled:opacity-50 text-sm sm:text-base"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl px-4 py-2 sm:px-6 sm:py-3 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/30 text-sm sm:text-base"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-2 shrink-0">
          <p className="text-slate-400 text-xs sm:text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Powered by Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;
