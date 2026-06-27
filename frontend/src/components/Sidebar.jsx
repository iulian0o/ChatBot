import "./styles/Sidebar.css";

function Sidebar({ sessions, activeId, onSelect, onNewChat }) {
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
            {s.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
