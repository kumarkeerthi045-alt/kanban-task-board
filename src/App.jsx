import { useMemo, useState } from "react";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import { useLocalStorageReducer } from "./hooks/useLocalStorageReducer";
import { boardReducer, COLUMNS, initialState, visibleTasks } from "./state/boardReducer";

export default function App() {
  const [state, dispatch] = useLocalStorageReducer("kanban-board-v1", boardReducer, initialState);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");

  const filtered = useMemo(
    () => visibleTasks(state.tasks, { search, priority }),
    [state.tasks, search, priority]
  );

  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.column === "done").length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <main className="app">
      <header className="top">
        <div>
          <h1>📋 Kanban Task Board</h1>
          <p className="sub">
            {done}/{total} done · {progress}% complete
          </p>
          <div className="progress" aria-label={`${progress}% complete`}>
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="filters">
          <input
            aria-label="Search tasks"
            placeholder="🔍 Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select aria-label="Filter by priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button className="ghost" onClick={() => dispatch({ type: "CLEAR_DONE" })} disabled={!done}>
            Clear done
          </button>
        </div>
      </header>

      <TaskForm onAdd={(task) => dispatch({ type: "ADD_TASK", ...task })} />

      <div className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={filtered.filter((t) => t.column === col.id)}
            dispatch={dispatch}
          />
        ))}
      </div>

      <footer>Drag cards between columns · Double-click a title to edit · Saved in your browser</footer>
    </main>
  );
}
