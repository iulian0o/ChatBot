import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatThread from "../components/ChatThread";
import InputBar from "../components/InputBar";
import "./styles/Review.css";

function makeTitle(text) {
  return text.slice(0, 30) + (text.length > 30 ? "..." : "");
}

function withEmptyMessages(session) {
  return {
    ...session,
    messages: [],
    messagesLoaded: false,
  };
}

function Review() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [error, setError] = useState(null);

  const activeSession = sessions.find((session) => session.id === activeId) || null;
  const messages = activeSession ? activeSession.messages : [];

  function handleAuthFailure() {
    setSessions([]);
    setActiveId(null);
    navigate("/login", { replace: true });
  }

  async function apiFetch(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      handleAuthFailure();
      throw new Error("Not authenticated");
    }

    return response;
  }

  function updateSession(id, updater) {
    setSessions((prev) =>
      prev.map((session) => (session.id === id ? updater(session) : session)),
    );
  }

  async function loadSessions() {
    setLoadingSessions(true);
    setError(null);

    try {
      const response = await apiFetch("/api/sessions");
      const data = await response.json();
      const loadedSessions = (data.sessions || []).map(withEmptyMessages);

      setSessions(loadedSessions);
      setActiveId((currentId) => {
        if (currentId && loadedSessions.some((session) => session.id === currentId)) {
          return currentId;
        }

        return loadedSessions[0]?.id || null;
      });
    } catch (err) {
      if (err.message !== "Not authenticated") {
        setError("Could not load your saved chats.");
      }
    } finally {
      setLoadingSessions(false);
    }
  }

  async function loadMessages(sessionId) {
    try {
      const response = await apiFetch(`/api/sessions/${sessionId}/messages`);
      const data = await response.json();

      updateSession(sessionId, (session) => ({
        ...session,
        messages: data.messages || [],
        messagesLoaded: true,
      }));
    } catch (err) {
      if (err.message !== "Not authenticated") {
        setError("Could not load messages for this chat.");
      }
    }
  }

  async function persistMessage(sessionId, message) {
    const response = await apiFetch(`/api/sessions/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Could not save message.");
    }
  }

  async function createSession({ title = "New chat", sessionLanguage = language } = {}) {
    const id = crypto.randomUUID();
    const response = await apiFetch("/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        id,
        title,
        language: sessionLanguage,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Could not create chat.");
    }

    const session = withEmptyMessages({
      id,
      title,
      language: sessionLanguage,
    });

    setSessions((prev) => [session, ...prev]);
    setActiveId(id);
    return session;
  }

  async function updateSessionDetails(sessionId, details) {
    const response = await apiFetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Could not update chat.");
    }

    updateSession(sessionId, (session) => ({
      ...session,
      ...details,
    }));
  }

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (!activeSession) return;

    setLanguage(activeSession.language || "javascript");

    if (!activeSession.messagesLoaded) {
      loadMessages(activeSession.id);
    }
  }, [activeId]);

  async function handleNewChat() {
    setError(null);

    try {
      await createSession();
    } catch (err) {
      if (err.message !== "Not authenticated") {
        setError(err.message);
      }
    }
  }

  async function handleDeleteSession(id) {
    setError(null);

    try {
      const response = await apiFetch(`/api/sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete chat.");
      }

      setSessions((prev) => prev.filter((session) => session.id !== id));
      if (activeId === id) {
        const nextSession = sessions.find((session) => session.id !== id);
        setActiveId(nextSession?.id || null);
      }
    } catch (err) {
      if (err.message !== "Not authenticated") {
        setError(err.message);
      }
    }
  }

  async function handleSend(text, lang) {
    setLoading(true);
    setError(null);

    let session = activeSession;

    try {
      if (!session) {
        session = await createSession({
          title: makeTitle(text),
          sessionLanguage: lang,
        });
      }

      const isFirstMessage = session.messages.length === 0;
      if (isFirstMessage && session.title === "New chat") {
        await updateSessionDetails(session.id, {
          title: makeTitle(text),
          language: lang,
        });
      }

      const userMsg = { role: "user", content: text };
      const historyToSend = [...session.messages, userMsg];

      updateSession(session.id, (current) => ({
        ...current,
        messages: [...current.messages, userMsg],
        messagesLoaded: true,
      }));
      await persistMessage(session.id, userMsg);

      const response = await apiFetch("/api/review", {
        method: "POST",
        body: JSON.stringify({
          code: text,
          language: lang,
          history: historyToSend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const assistantMsg = { role: "assistant", content: data.reply };
      updateSession(session.id, (current) => ({
        ...current,
        messages: [...current.messages, assistantMsg],
      }));
      await persistMessage(session.id, assistantMsg);
    } catch (err) {
      if (err.message !== "Not authenticated") {
        setError(err.message || "Could not reach the server. Is the backend running?");
      }
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
        {loadingSessions ? (
          <p className="review-empty-state">Loading your chats...</p>
        ) : (
          <ChatThread messages={messages} loading={loading} />
        )}
        <InputBar
          onSend={handleSend}
          disabled={loading || loadingSessions}
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>
    </div>
  );
}

export default Review;
