import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  elo,
} from "../shared.js";
export type Input = Readonly<{
  readonly initialRating: number;
  readonly opponentRatings: readonly number[];
  readonly actualScores: readonly number[];
  readonly callerKFactor: number;
  readonly callerRatingScale: number;
}>;
export type Output = Readonly<{
  readonly updatedRating: number;
  readonly sequentialRatingHistory: readonly number[];
  readonly expectedScoresBeforeEachGame: readonly number[];
}>;
const inputFields = [
  { id: "initialRating", label: "Initial rating", kind: "number" },
  { id: "opponentRatings", label: "Opponent ratings", kind: "numberList" },
  { id: "actualScores", label: "Actual scores", kind: "numberList" },
  { id: "callerKFactor", label: "Caller k factor", kind: "number" },
  { id: "callerRatingScale", label: "Caller rating scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerRatingScale, "callerRatingScale");
  nonnegative(input.callerKFactor, "callerKFactor");
  input.actualScores.forEach((v) => fraction(v, "actualScores"));
  aligned(input.opponentRatings, input.actualScores, "opponentRatings");
  let r = input.initialRating;
  const history: number[] = [],
    scores: number[] = [];
  input.opponentRatings.forEach((v, i) => {
    const e = elo(r, v, input.callerRatingScale);
    scores.push(e);
    r += input.callerKFactor * (input.actualScores[i] - e);
    history.push(r);
  });
  return {
    updatedRating: r,
    sequentialRatingHistory: history,
    expectedScoresBeforeEachGame: scores,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialRating: 1500,
  opponentRatings: [1500],
  actualScores: [1],
  callerKFactor: 32,
  callerRatingScale: 400,
} satisfies Input;
export const exampleOutput = {
  updatedRating: 1516,
  sequentialRatingHistory: [1516],
  expectedScoresBeforeEachGame: [0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/elo-rating-update-k-factor",
  title: "Elo Rating Update K-Factor Calculator",
  description:
    "Apply caller Elo K/scale sequentially to explicit fractional game scores, recomputing expectancy after each game; no federation defaults, rounding or batch-frozen initial rating.",
  inputs: inputFields,
  outputs: [
    { id: "updatedRating", label: "Updated rating", kind: "number" },
    {
      id: "sequentialRatingHistory",
      label: "Sequential rating history",
      kind: "numberList",
    },
    {
      id: "expectedScoresBeforeEachGame",
      label: "Expected scores before each game",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      initialRating: value.initialRating as number,
      opponentRatings: value.opponentRatings as readonly number[],
      actualScores: value.actualScores as readonly number[],
      callerKFactor: value.callerKFactor as number,
      callerRatingScale: value.callerRatingScale as number,
    }),
});
export const run = tool.execute;
export default tool;
