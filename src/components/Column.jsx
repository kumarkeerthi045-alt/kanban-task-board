import { useState } from "react";
import TaskCard from "./TaskCard";

export default function Column({ column, tasks, dispatch }) {
  const [isOver, setIsOver] = useState(false);

  function handleDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  // Dropped on empty space in the column: put task at the end
  function handleDrop(e) {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id) dispatch({ type: "MOVE_TASK", id, column: column.id });
  }

  // Dropped on top of another card: put task just before that card
  function handleDropBefore(e, beforeId) {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id && id !== beforeId) dispatch({ type: "MOVE_TASK", id, column: column.id, beforeId });
  }

  return (
    <section
      className={`column ${isOver ? "over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <header>
        <h2>{column.title}</h2>
        <span className="count">{tasks.length}</span>
      </header>
      <div className="cards">
        {tasks.length === 0 && <p className="empty">Drop tasks here</p>}
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            dispatch={dispatch}
            onDragStart={handleDragStart}
            onDropBefore={handleDropBefore}
          />
        ))}
      </div>
    </section>
  );
}
