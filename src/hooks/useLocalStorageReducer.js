import { useEffect, useReducer } from "react";

// Custom hook: works like useReducer, but saves state to localStorage
// so tasks survive a page refresh.
export function useLocalStorageReducer(key, reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : init;
    } catch {
      return init; // corrupted data or storage blocked: fall back to defaults
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage full or unavailable: app still works in memory */
    }
  }, [key, state]);

  return [state, dispatch];
}
