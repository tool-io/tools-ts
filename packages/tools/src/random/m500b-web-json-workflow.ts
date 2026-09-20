import { simpleError } from "../core/simple.js";
import { distinct } from "./m500b-web-json-json.js";

export type Transition = { readonly from: string; readonly to: string };
/** Closed supplied state graph, safe for the legacy adjacency-map algorithms. */
export const workflowGraph = (
  states: readonly string[],
  transitions: readonly Transition[],
  start: string,
): Record<string, string[]> => {
  distinct(states, "states");
  distinct(
    transitions.map((e) => JSON.stringify([e.from, e.to])),
    "transitions",
  );
  if (states.some((s) => !/^[A-Za-z0-9_-]+(?![\s\S])/u.test(s)))
    simpleError(
      "states",
      "Use exact ASCII state identifiers.",
      "invalid_state",
    );
  if (!states.includes(start))
    simpleError("start", "Start must name a supplied state.", "unknown_state");
  if (
    transitions.some((e) => !states.includes(e.from) || !states.includes(e.to))
  )
    simpleError(
      "transitions",
      "Every endpoint must name a supplied state.",
      "unknown_state",
    );
  return Object.fromEntries(
    states.map((state) => [
      state,
      transitions.filter((e) => e.from === state).map((e) => e.to),
    ]),
  );
};
