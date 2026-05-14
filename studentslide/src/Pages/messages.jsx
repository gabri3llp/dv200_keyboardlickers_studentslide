import { useState } from "react";

const mockChats = [
  { id: 1, name: "NAME AND SURNAME", preview: "Hi there is this text book still available? Im willing to give you...", time: "", type: "buying" },
  { id: 2, name: "JOHN DOE", preview: "Yes, the textbook is still available! I can offer it to you for $25.", time: "10:00 AM", type: "selling" },
  { id: 3, name: "JANE SMITH", preview: "I'm interested in the textbook as well. Is it in good condition?", time: "11:30 AM", type: "trades" },
  { id: 4, name: "ALEX BROWN", preview: "Can I pick it up later today? I'll be free after 3 PM.", time: "2:00 PM", type: "buying" },
];

const filters = ["All chats", "Buying", "Selling", "Trades"];

export default function Messages() {
  const [activeFilter, setActiveFilter] = useState("All chats");

  const filteredChats = mockChats.filter(chat =>
    activeFilter === "All chats" || chat.type === activeFilter.toLowerCase()
  );

  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Title text */}

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

        {/* Chat List */}

        {filteredChats.map(chat => (
          <div key={chat.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "8px", marginBottom: "8px", background: "#1a1a1a", cursor: "pointer" }}>
            
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#555", flexShrink: 0 }} />  
            
            {/* flexShrink= stops from shrinking if page shrinks Flex=Fill availibble space to push to right  */}

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>      {chat.name}</div>
              <div style={{ color: "#888", fontSize: "14px" }}>      {chat.preview}</div>
            </div>
            
            <div style={{ color: "#888", fontSize: "13px", flexShrink: 0 }}>     {chat.time}</div>
          </div>
        ))}

        {/* End of messages */}
        <p style={{ textAlign: "center", color: "#555", marginTop: "40px", fontSize: "13px" }}>
          YOU'VE REACHED THE END OF YOUR RECENT MESSAGES :(
        </p>

      </div>
    </div>
  );
}