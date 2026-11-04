
import { useEffect, useState } from "react";
import Footer from "../Component/footer";
import Navbar from "../Component/navbar";
import {
  getDemoTradeMessages,
  TRADE_MESSAGES_UPDATED,
} from "../data/demoTrades";

const mockChats = [
  {
    id: 1,
    name: "NAME AND SURNAME",
    preview: "Hi there is this text book still available? Im willing to give you...",
    time: "",
    type: "buying",
    messages: [
      {
        from: "them",
        text: "Hi there is this text book still available? Im willing to give you...",
      },
    ],
  },
  {
    id: 2,
    name: "JOHN DOE",
    preview: "Yes, the textbook is still available! I can offer it to you for R250.",
    time: "10:00 AM",
    type: "selling",
    messages: [
      {
        from: "them",
        text: "Yes, the textbook is still available! I can offer it to you for R250.",
      },
    ],
  },
  {
    id: 3,
    name: "JANE SMITH",
    preview: "I'm interested in the textbook as well. Is it in good condition?",
    time: "11:30 AM",
    type: "trades",
    messages: [
      {
        from: "them",
        text: "I'm interested in the textbook as well. Is it in good condition?",
      },
    ],
  },
  {
    id: 4,
    name: "ALEX BROWN",
    preview: "Can I pick it up later today? I'll be free after 3 PM.",
    time: "2:00 PM",
    type: "buying",
    messages: [
      {
        from: "them",
        text: "Can I pick it up later today? I'll be free after 3 PM.",
      },
    ],
  },
];

const filters = ["All chats", "Buying", "Selling", "Trades"];

const quickReplies = [
  "Yes, still available!",
  "Sorry, already sold.",
  "Can we meet on campus?",
  "What's your best price?",
  "I'll take it!",
];

const loadChats = () => [...getDemoTradeMessages(), ...mockChats];

export default function Messages({ user, onLogout }) {
  const [activeFilter, setActiveFilter] = useState("All chats");
  const [openChat, setOpenChat] = useState(null);
  const [chats, setChats] = useState(loadChats);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const refreshTradeMessages = () => setChats(loadChats());

    window.addEventListener(TRADE_MESSAGES_UPDATED, refreshTradeMessages);
    window.addEventListener("storage", refreshTradeMessages);

    return () => {
      window.removeEventListener(TRADE_MESSAGES_UPDATED, refreshTradeMessages);
      window.removeEventListener("storage", refreshTradeMessages);
    };
  }, []);

  const filteredChats = chats.filter(
    (chat) =>
      activeFilter === "All chats" ||
      chat.type === activeFilter.toLowerCase()
  );

  const sendMessage = (text) => {
    if (!text.trim() || !openChat) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === openChat.id
          ? {
              ...chat,
              messages: [...chat.messages, { from: "me", text }],
              preview: text,
            }
          : chat
      )
    );

    setOpenChat((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "me", text }],
    }));

    setInputText("");
  };

  return (
    <div className="messages-page">
      <Navbar
        isLoggedIn={Boolean(user)}
        user={user}
        onLogout={onLogout}
      />

      <main className="messages-main">
        {openChat ? (
          <section className="messages-chat">
            <div className="messages-chat-header">
              <button
                className="messages-back-btn"
                onClick={() => setOpenChat(null)}
              >
                ← Back
              </button>

              <div className="messages-avatar">
                {openChat.name?.charAt(0)}
              </div>

              <div className="messages-user-info">
                <div className="messages-name">{openChat.name}</div>
                <div className="messages-type">
                  {openChat.type}
                </div>
              </div>
            </div>

            {openChat.trade && (
              <div className="messages-trade-info">
                Trade request:{" "}
                <strong>
                  {openChat.trade.offeredListing.title}
                </strong>{" "}
                for{" "}
                <strong>
                  {openChat.trade.requestedListing.title}
                </strong>
              </div>
            )}

            <div className="messages-conversation">
              {openChat.messages.map((msg, i) => (
                <div
                  key={`${msg.text}-${i}`}
                  className={`messages-row ${
                    msg.from === "me" ? "sent" : "received"
                  }`}
                >
                  <div
                    className={`messages-bubble ${
                      msg.from === "me" ? "sent" : "received"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="messages-quick-replies">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  className="messages-quick-btn"
                  onClick={() => sendMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>

            <form
              className="messages-input-area"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputText);
              }}
            >
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                aria-label="Type a message"
              />

              <button type="submit" className="messages-send-btn">
                Send
              </button>
            </form>
          </section>
        ) : (
          <section className="messages-list">
            <div className="messages-heading">
              <h2>Messages</h2>
              <p>ACTIVE TRADES AND INQUIRIES</p>
            </div>

            <div className="messages-filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`messages-filter ${
                    activeFilter === filter ? "active" : ""
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="messages-chat-list">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className="messages-chat-card"
                  onClick={() => setOpenChat(chat)}
                >
                  <div
                    className={`messages-avatar ${
                      chat.type === "trades" ? "trade-avatar" : ""
                    }`}
                  >
                    {chat.name?.charAt(0)}
                  </div>

                  <div className="messages-chat-details">
                    <div className="messages-name">{chat.name}</div>
                    <div className="messages-preview">
                      {chat.preview}
                    </div>
                  </div>

                  <div className="messages-time">{chat.time}</div>
                </button>
              ))}

              {filteredChats.length === 0 && (
                <div className="messages-empty">
                  No messages in this category yet.
                </div>
              )}
            </div>

            <p className="messages-end">
              YOU'VE REACHED THE END OF YOUR RECENT MESSAGES
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
