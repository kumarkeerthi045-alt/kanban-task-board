import { useState } from "react";
import { COLUMNS } from "../state/boardReducer";

export default function TaskCard({ task, dispatch, onDragStart, onDropBefore }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  function save() {
    const t = title.trim();
    if (t) dispatch({ type: "UPDATE_TASK", id: task.id, changes: { title: t } });
    else setTitle(task.title);
    setEditing(false);
  }

  // Keyboard-friendly alternative to drag and drop
  const colIndex = COLUMNS.findIndex((c) => c.id === task.column);
  const moveTo = (i) => dispatch({ type: "MOVE_TASK", id: task.id, column: COLUMNS[i].id });

  return (
    <article
      className={`card priority-${task.priority}`}
      draggable={!editing}
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropBefore(e, task.id)}
    >
      <div className="card-top">
        <span className={`badge ${task.priority}`}>{task.priority}</span>
        <button
          className="icon"
          aria-label={`Delete ${task.title}`}
          onClick={() => dispatch({ type: "DELETE_TASK", id: task.id })}
        >
          ✕
        </button>
      </div>

      {editing ? (
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setTitle(task.title);
              setEditing(false);
            }
          }}
        />
      ) : (
        <h3 onDoubleClick={() => setEditing(true)} title="Double-click to edit">
          {task.title}
        </h3>
      )}
      {task.description && <p>{task.description}</p>}

      <div className="card-actions">
        <button disabled={colIndex === 0} onClick={() => moveTo(colIndex - 1)} aria-label="Move left">
          ←
        </button>
        <button
          disabled={colIndex === COLUMNS.length - 1}
          onClick={() => moveTo(colIndex + 1)}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </article>
  );
}
