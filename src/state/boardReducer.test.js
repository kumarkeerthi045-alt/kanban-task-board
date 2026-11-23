import { describe, expect, it } from "vitest";
import { boardReducer, visibleTasks } from "./boardReducer";

const empty = { tasks: [] };

describe("boardReducer", () => {
  it("adds a task to To Do by default", () => {
    const s = boardReducer(empty, { type: "ADD_TASK", id: "a", title: "  Learn React  " });
    expect(s.tasks).toHaveLength(1);
    expect(s.tasks[0]).toMatchObject({ id: "a", title: "Learn React", column: "todo", priority: "medium" });
  });

  it("ignores empty titles", () => {
    const s = boardReducer(empty, { type: "ADD_TASK", title: "   " });
    expect(s.tasks).toHaveLength(0);
  });

  it("updates and deletes a task", () => {
    let s = boardReducer(empty, { type: "ADD_TASK", id: "a", title: "X" });
    s = boardReducer(s, { type: "UPDATE_TASK", id: "a", changes: { priority: "high" } });
    expect(s.tasks[0].priority).toBe("high");
    s = boardReducer(s, { type: "DELETE_TASK", id: "a" });
    expect(s.tasks).toHaveLength(0);
  });

  it("moves a task to another column, before a given task", () => {
    let s = empty;
    s = boardReducer(s, { type: "ADD_TASK", id: "a", title: "A", column: "todo" });
    s = boardReducer(s, { type: "ADD_TASK", id: "b", title: "B", column: "done" });
    s = boardReducer(s, { type: "MOVE_TASK", id: "a", column: "done", beforeId: "b" });
    expect(s.tasks.map((t) => t.id)).toEqual(["a", "b"]);
    expect(s.tasks.every((t) => t.column === "done")).toBe(true);
  });

  it("clears completed tasks", () => {
    let s = empty;
    s = boardReducer(s, { type: "ADD_TASK", id: "a", title: "A", column: "done" });
    s = boardReducer(s, { type: "ADD_TASK", id: "b", title: "B" });
    s = boardReducer(s, { type: "CLEAR_DONE" });
    expect(s.tasks.map((t) => t.id)).toEqual(["b"]);
  });
});

describe("visibleTasks", () => {
  const tasks = [
    { id: "1", title: "Fix login bug", description: "", priority: "high" },
    { id: "2", title: "Write docs", description: "API login section", priority: "low" },
    { id: "3", title: "Deploy", description: "", priority: "high" },
  ];

  it("filters by search text in title or description", () => {
    expect(visibleTasks(tasks, { search: "LOGIN" }).map((t) => t.id)).toEqual(["1", "2"]);
  });

  it("filters by priority", () => {
    expect(visibleTasks(tasks, { priority: "high" }).map((t) => t.id)).toEqual(["1", "3"]);
  });
});
