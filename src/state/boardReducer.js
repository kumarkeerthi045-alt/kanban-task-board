// All board changes go through this pure reducer, so the logic is easy to test.

export const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "In Progress" },
  { id: "done", title: "Done" },
];

export const PRIORITIES = ["low", "medium", "high"];

export const initialState = {
  tasks: [
    { id: "t1", title: "Set up project repo", description: "", priority: "high", column: "done", createdAt: 1 },
    { id: "t2", title: "Design the UI", description: "Sketch columns and cards", priority: "medium", column: "doing", createdAt: 2 },
    { id: "t3", title: "Write unit tests", description: "", priority: "low", column: "todo", createdAt: 3 },
  ],
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

export function boardReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK": {
      const title = action.title.trim();
      if (!title) return state; // ignore empty titles
      const task = {
        id: action.id ?? newId(),
        title,
        description: action.description?.trim() ?? "",
        priority: PRIORITIES.includes(action.priority) ? action.priority : "medium",
        column: action.column ?? "todo",
        createdAt: Date.now(),
      };
      return { ...state, tasks: [...state.tasks, task] };
    }

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.changes } : t)),
      };

    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };

    case "MOVE_TASK": {
      // Move a task to another column, optionally placing it before another task
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task) return state;
      const rest = state.tasks.filter((t) => t.id !== action.id);
      const moved = { ...task, column: action.column };
      const beforeIndex = action.beforeId ? rest.findIndex((t) => t.id === action.beforeId) : -1;
      if (beforeIndex === -1) return { ...state, tasks: [...rest, moved] };
      return {
        ...state,
        tasks: [...rest.slice(0, beforeIndex), moved, ...rest.slice(beforeIndex)],
      };
    }

    case "CLEAR_DONE":
      return { ...state, tasks: state.tasks.filter((t) => t.column !== "done") };

    case "RESET":
      return action.state ?? initialState;

    default:
      return state;
  }
}

// Helper used by the UI: filter by search text and priority
export function visibleTasks(tasks, { search = "", priority = "all" } = {}) {
  const q = search.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (priority === "all" || t.priority === priority) &&
      (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  );
}
