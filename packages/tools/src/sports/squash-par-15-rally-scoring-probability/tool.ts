import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  probability,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerIndependentRallyWinProbability: number;
  readonly observedPlayerScore: number;
  readonly observedOpponentScore: number;
  readonly callerTargetScore: number;
  readonly callerWinByPoints: number;
}>;
export type Output = Readonly<{ readonly modeledGameWinProbability: number }>;
const inputFields = [
  {
    id: "callerIndependentRallyWinProbability",
    label: "Caller independent rally win probability",
    kind: "number",
  },
  { id: "observedPlayerScore", label: "Observed player score", kind: "number" },
  {
    id: "observedOpponentScore",
    label: "Observed opponent score",
    kind: "number",
  },
  { id: "callerTargetScore", label: "Caller target score", kind: "number" },
  { id: "callerWinByPoints", label: "Caller win by points", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  probability(input.callerIndependentRallyWinProbability);
  bounded(input.callerTargetScore, "target", 1, 50);
  if (input.callerWinByPoints !== 1 && input.callerWinByPoints !== 2)
    simpleError("rules", "Explicit win by one or two required.");
  bounded(input.observedPlayerScore, "score", 0, 100);
  bounded(input.observedOpponentScore, "score", 0, 100);
  const p = input.callerIndependentRallyWinProbability,
    target = input.callerTargetScore,
    winby = input.callerWinByPoints,
    memo = new Map<string, number>();
  const solve = (a: number, b: number): number => {
    if (a >= target && a - b >= winby) return 1;
    if (b >= target && b - a >= winby) return 0;
    if (winby === 2 && a >= target - 1 && b >= target - 1) {
      if (p === 0) return 0;
      if (p === 1) return 1;
      const deuce = (p * p) / (p * p + (1 - p) * (1 - p));
      return a === b ? deuce : a > b ? p + (1 - p) * deuce : p * deuce;
    }
    const key = a + "," + b,
      cached = memo.get(key);
    if (cached !== undefined) return cached;
    const v = p * solve(a + 1, b) + (1 - p) * solve(a, b + 1);
    memo.set(key, v);
    return v;
  };
  if (
    Math.max(input.observedPlayerScore, input.observedOpponentScore) >=
      target &&
    Math.abs(input.observedPlayerScore - input.observedOpponentScore) >= winby
  )
    simpleError("score", "Active not already completed game state required.");
  return {
    modeledGameWinProbability: solve(
      input.observedPlayerScore,
      input.observedOpponentScore,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentRallyWinProbability: 0.5,
  observedPlayerScore: 14,
  observedOpponentScore: 14,
  callerTargetScore: 15,
  callerWinByPoints: 2,
} satisfies Input;
export const exampleOutput = {
  modeledGameWinProbability: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/squash-par-15-rally-scoring-probability",
  title: "Squash PAR-15 Rally Win Probability",
  description:
    "Solve bounded caller PAR target/win-by scoring state under independent constant rally probability, including analytic deuce; no universal PAR-15 rules, forecast calibration or betting advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledGameWinProbability",
      label: "Modeled game win probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentRallyWinProbability:
        value.callerIndependentRallyWinProbability as number,
      observedPlayerScore: value.observedPlayerScore as number,
      observedOpponentScore: value.observedOpponentScore as number,
      callerTargetScore: value.callerTargetScore as number,
      callerWinByPoints: value.callerWinByPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
