import "./styles/Sidebar.css";

function Sidebar({ sessions, activeId, onSelect, onNewChat, onDelete }) {
  return (
    <aside className="sidebar">
      <button className="sidebar-new" onClick={onNewChat}>
        + New chat
      </button>

      <ul className="sidebar-list">
        {sessions.map((s) => (
          <li
            key={s.id}
            className={`sidebar-item ${s.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(s.id)}
          >
            <span className="sidebar-title">{s.title}</span>
            <button
              className="sidebar-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s.id);
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
