import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatThread from "../components/ChatThread";
import InputBar from "../components/InputBar";
import "./styles/Review.css";

function makeTitle(text) {
  return text.slice(0, 30) + (text.length > 30 ? "…" : "");
}

function Review() {
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("chat-sessions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeId, setActiveId] = useState(() => {
    return localStorage.getItem("chat-active-id") || null;
  });

  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("chat-sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeId) localStorage.setItem("chat-active-id", activeId);
  }, [activeId]);

  const activeSession = sessions.find((s) => s.id === activeId) || null;
  const messages = activeSession ? activeSession.messages : [];

  function handleNewChat() {
    const id = crypto.randomUUID();
    const newSession = { id, title: "New chat", language, messages: [] };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(id);
    setError(null);
  }

  function handleDeleteSession(id) {
  setSessions((prev) => prev.filter((s) => s.id !== id))
  if (activeId === id) {
    setActiveId(null)
    localStorage.removeItem("chat-active-id")
  }
}

  function updateMessages(id, updater) {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, messages: updater(s.messages) } : s,
      ),
    );
  }

  async function handleSend(text, lang) {
    let currentId = activeId;
    if (!currentId) {
      currentId = crypto.randomUUID();
      const newSession = {
        id: currentId,
        title: makeTitle(text),
        language: lang,
        messages: [],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveId(currentId);
    }

    const userMsg = { role: "user", content: text };

    updateMessages(currentId, (msgs) => {
      if (msgs.length === 0) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentId ? { ...s, title: makeTitle(text) } : s,
          ),
        );
      }
      return [...msgs, userMsg];
    });

    setLoading(true);
    setError(null);

    const currentMessages = activeSession ? activeSession.messages : [];
    const historyToSend = [...currentMessages, userMsg];

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: text,
          language: lang,
          history: historyToSend,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      updateMessages(currentId, (msgs) => [
        ...msgs,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="review-layout">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={handleNewChat}
        onDelete={handleDeleteSession}
      />
      <div className="review-main">
        {error && <p className="review-error">{error}</p>}
        <ChatThread messages={messages} loading={loading} />
        <InputBar
          onSend={handleSend}
          disabled={loading}
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>
    </div>
  );
}

export default Review;
