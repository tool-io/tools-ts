import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly callerSignificanceScores: readonly number[];
  readonly callerRiskScores: readonly number[];
}>;
export type Output = Readonly<{
  readonly priorityProducts: readonly number[];
  readonly stablePriorityOrderIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerSignificanceScores",
    label: "Caller significance scores",
    kind: "numberList",
  },
  { id: "callerRiskScores", label: "Caller risk scores", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerSignificanceScores.forEach((v) =>
    nonnegative(v, "callerSignificanceScores"),
  );
  input.callerRiskScores.forEach((v) => nonnegative(v, "callerRiskScores"));
  aligned(
    input.callerSignificanceScores,
    input.callerRiskScores,
    "callerSignificanceScores",
  );
  const p = input.callerSignificanceScores.map(
    (v, i) => v * input.callerRiskScores[i],
  );
  if (p.some((v) => !Number.isFinite(v)))
    simpleError("scores", "Finite priority products required.");
  return {
    priorityProducts: p,
    stablePriorityOrderIndices: p
      .map((_, i) => i)
      .sort((a, b) => p[b] - p[a] || a - b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSignificanceScores: [2, 3, 3],
  callerRiskScores: [4, 2, 2],
} satisfies Input;
export const exampleOutput = {
  priorityProducts: [8, 6, 6],
  stablePriorityOrderIndices: [0, 1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/damage-priority-rank-scorer",
  title: "Damage Priority Queue Rank Scorer (significance x risk)",
  description:
    "Rank caller damage significance×risk assessments with explicit stable ties, retaining products; score is triage policy, not calibrated expected harm or treatment priority authority.",
  inputs: inputFields,
  outputs: [
    { id: "priorityProducts", label: "Priority products", kind: "numberList" },
    {
      id: "stablePriorityOrderIndices",
      label: "Stable priority order indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSignificanceScores:
        value.callerSignificanceScores as readonly number[],
      callerRiskScores: value.callerRiskScores as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
