import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned, minimum } from "../shared.js";
export type Input = Readonly<{
  readonly perPageRemainingTurnBudgets: readonly number[];
  readonly turnsPerViewingSession: readonly number[];
}>;
export type Output = Readonly<{
  readonly maximumCompleteViewingSessions: number;
  readonly remainingTurnsAfterSessions: readonly number[];
  readonly limitingPageIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "perPageRemainingTurnBudgets",
    label: "Per page remaining turn budgets",
    kind: "numberList",
  },
  {
    id: "turnsPerViewingSession",
    label: "Turns per viewing session",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.perPageRemainingTurnBudgets.forEach((v) =>
    count(v, "perPageRemainingTurnBudgets"),
  );
  input.turnsPerViewingSession.forEach((v) =>
    count(v, "turnsPerViewingSession"),
  );
  aligned(
    input.perPageRemainingTurnBudgets,
    input.turnsPerViewingSession,
    "perPageRemainingTurnBudgets",
  );
  const caps = input.turnsPerViewingSession.flatMap((v, i) =>
    v ? [Math.floor(input.perPageRemainingTurnBudgets[i] / v)] : [],
  );
  if (!caps.length)
    simpleError("turns", "At least one page turns per session required.");
  const n = minimum(caps);
  return {
    maximumCompleteViewingSessions: n,
    remainingTurnsAfterSessions: input.perPageRemainingTurnBudgets.map(
      (v, i) => v - n * input.turnsPerViewingSession[i],
    ),
    limitingPageIndices: input.turnsPerViewingSession.flatMap((v, i) =>
      v && Math.floor(input.perPageRemainingTurnBudgets[i] / v) === n
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  perPageRemainingTurnBudgets: [10, 4, 20],
  turnsPerViewingSession: [1, 2, 0],
} satisfies Input;
export const exampleOutput = {
  maximumCompleteViewingSessions: 2,
  remainingTurnsAfterSessions: [8, 0, 20],
  limitingPageIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/proof-book-turn-frequency-limit",
  title: "Proof Book Page Turn Frequency Limit Calculator",
  description:
    "Budget complete viewing sessions across independently declared per-page turn capacities, retaining local bottlenecks; no universal page fatigue or handling frequency rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumCompleteViewingSessions",
      label: "Maximum complete viewing sessions",
      kind: "number",
    },
    {
      id: "remainingTurnsAfterSessions",
      label: "Remaining turns after sessions",
      kind: "numberList",
    },
    {
      id: "limitingPageIndices",
      label: "Limiting page indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      perPageRemainingTurnBudgets:
        value.perPageRemainingTurnBudgets as readonly number[],
      turnsPerViewingSession: value.turnsPerViewingSession as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
