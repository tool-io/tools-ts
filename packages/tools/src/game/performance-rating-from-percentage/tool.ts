import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, mean } from "../shared.js";
export type Input = Readonly<{
  readonly opponentRatings: readonly number[];
  readonly tournamentScorePoints: number;
  readonly callerRatingScale: number;
}>;
export type Output = Readonly<{
  readonly logisticPerformanceRating: number;
  readonly observedScorePercent: number;
  readonly opponentMeanRating: number;
}>;
const inputFields = [
  { id: "opponentRatings", label: "Opponent ratings", kind: "numberList" },
  {
    id: "tournamentScorePoints",
    label: "Tournament score points",
    kind: "number",
  },
  { id: "callerRatingScale", label: "Caller rating scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerRatingScale, "callerRatingScale");
  const avg = mean(input.opponentRatings),
    f = input.tournamentScorePoints / input.opponentRatings.length;
  if (f <= 0 || f >= 1)
    simpleError(
      "score",
      "Finite logistic performance requires score strictly between zero and all available points.",
    );
  if (input.opponentRatings.some((v) => Math.abs(v) > 1000000))
    simpleError("ratings", "Bounded observed ratings required.");
  return {
    logisticPerformanceRating:
      avg + input.callerRatingScale * Math.log10(f / (1 - f)),
    observedScorePercent: 100 * f,
    opponentMeanRating: avg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  opponentRatings: [1500, 1500],
  tournamentScorePoints: 1,
  callerRatingScale: 400,
} satisfies Input;
export const exampleOutput = {
  logisticPerformanceRating: 1500,
  observedScorePercent: 50,
  opponentMeanRating: 1500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/performance-rating-from-percentage",
  title: "Performance Rating From Score Percent",
  description:
    "Invert explicit logistic score fraction about observed opponent mean; heuristic performance approximation, not official tournament/federation table or full unequal-opponent likelihood fit. Endpoints undefined.",
  inputs: inputFields,
  outputs: [
    {
      id: "logisticPerformanceRating",
      label: "Logistic performance rating",
      kind: "number",
    },
    {
      id: "observedScorePercent",
      label: "Observed score percent",
      kind: "number",
    },
    { id: "opponentMeanRating", label: "Opponent mean rating", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      opponentRatings: value.opponentRatings as readonly number[],
      tournamentScorePoints: value.tournamentScorePoints as number,
      callerRatingScale: value.callerRatingScale as number,
    }),
});
export const run = tool.execute;
export default tool;
