import { useState } from "react";

const mockChats = [
  { id: 1, name: "NAME AND SURNAME", preview: "Hi there is this text book still available? Im willing to give you...", time: "", type: "buying",
    messages: [{ from: "them", text: "Hi there is this text book still available? Im willing to give you..." }] },
  { id: 2, name: "JOHN DOE", preview: "Yes, the textbook is still available! I can offer it to you for $25.", time: "10:00 AM", type: "selling",
    messages: [{ from: "them", text: "Yes, the textbook is still available! I can offer it to you for $25." }] },
  { id: 3, name: "JANE SMITH", preview: "I'm interested in the textbook as well. Is it in good condition?", time: "11:30 AM", type: "trades",
    messages: [{ from: "them", text: "I'm interested in the textbook as well. Is it in good condition?" }] },
  { id: 4, name: "ALEX BROWN", preview: "Can I pick it up later today? I'll be free after 3 PM.", time: "2:00 PM", type: "buying",
    messages: [{ from: "them", text: "Can I pick it up later today? I'll be free after 3 PM." }] },
];

const filters = ["All chats", "Buying", "Selling", "Trades"];

const quickReplies = [
  "Yes, still available!",
  "Sorry, already sold.",
  "Can we meet on campus?",
  "What's your best price?",
  "I'll take it!",
];

export default function Messages() {
  const [activeFilter, setActiveFilter] = useState("All chats");
  const [openChat, setOpenChat] = useState(null);
  const [chats, setChats] = useState(mockChats);
  const [inputText, setInputText] = useState("");

  const filteredChats = chats.filter(chat =>
    activeFilter === "All chats" || chat.type === activeFilter.toLowerCase()
  );

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setChats(prev => prev.map(chat =>
      chat.id === openChat.id
        ? { ...chat, messages: [...chat.messages, { from: "me", text }], preview: text }
        : chat
    ));
    setOpenChat(prev => ({ ...prev, messages: [...prev.messages, { from: "me", text }] }));
    setInputText("");
  };

  // Chat view
  if (openChat) {
    return (
      <div style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
        
        {/* Chat header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", background: "#1a1a1a", borderBottom: "1px solid #333" }}>
          <button onClick={() => setOpenChat(null)} style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontSize: "20px", fontWeight: "bold" }}>←</button>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#555" }} />
          <div>
            <div style={{ fontWeight: "bold" }}>{openChat.name}</div>
            <div style={{ color: "#888", fontSize: "12px" }}>{openChat.type}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
          {openChat.messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
              <div style={{
                background: msg.from === "me" ? "#a78bfa" : "#222",
                color: "white",
                padding: "10px 16px",
                borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                maxWidth: "65%",
                fontSize: "14px",
                lineHeight: "1.5",
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div style={{ padding: "0 20px 12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {quickReplies.map((reply, i) => (
            <button key={i} onClick={() => sendMessage(reply)} style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#aaa",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#a78bfa"; e.target.style.color = "#a78bfa"; }}
              onMouseLeave={e => { e.target.style.borderColor = "#333"; e.target.style.color = "#aaa"; }}
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: "12px", padding: "12px 20px 24px", borderTop: "1px solid #222" }}>
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(inputText)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "24px",
              padding: "12px 20px",
              color: "white",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button onClick={() => sendMessage(inputText)} style={{
            background: "#a78bfa",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            cursor: "pointer",
            fontSize: "20px",
            color: "white",
          }}>
            ↑
          </button>
        </div>
      </div>
    );
  }

  // Chat list view
  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        <h2 style={{ fontWeight: "bold", fontSize: "28px", marginBottom: "4px" }}>Messages</h2>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "12px", letterSpacing: "1px" }}>ACTIVE TRADES AND INQUIRIES</p>

        {/* Filter buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "8px 18px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background: activeFilter === f ? "#a78bfa" : "#222",
              color: activeFilter === f ? "white" : "#aaa",
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Chat list */}
        {filteredChats.map(chat => (
          <div key={chat.id} onClick={() => setOpenChat(chat)} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "8px", marginBottom: "8px", background: "#1a1a1a", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "#222"}
            onMouseLeave={e => e.currentTarget.style.background = "#1a1a1a"}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#555", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{chat.name}</div>
              <div style={{ color: "#888", fontSize: "14px" }}>{chat.preview}</div>
            </div>
            <div style={{ color: "#888", fontSize: "13px", flexShrink: 0 }}>{chat.time}</div>
          </div>
        ))}

        <p style={{ textAlign: "center", color: "#555", marginTop: "40px", fontSize: "13px" }}>
          YOU'VE REACHED THE END OF YOUR RECENT MESSAGES :(
        </p>
      </div>
    </div>
  );
}