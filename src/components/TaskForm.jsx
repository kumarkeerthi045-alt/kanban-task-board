import { useState } from "react";
import { PRIORITIES } from "../state/boardReducer";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("medium");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        aria-label="Task title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={80}
      />
      <input
        aria-label="Description"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={200}
      />
      <select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p[0].toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>
      <button type="submit" disabled={!title.trim()}>
        + Add task
      </button>
    </form>
  );
}
