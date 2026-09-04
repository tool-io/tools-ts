import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, curve } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerMatchedAngerWeatherScores: readonly number[];
  readonly callerVerifiedAngerRatings: readonly number[];
  readonly queryWeatherScore: number;
}>;
export type Output = Readonly<{
  readonly callerInterpolatedAngerRating: number;
  readonly localObservedSecantSlope: number;
}>;
const inputFields = [
  {
    id: "callerMatchedAngerWeatherScores",
    label: "Caller matched anger weather scores",
    kind: "numberList",
  },
  {
    id: "callerVerifiedAngerRatings",
    label: "Caller verified anger ratings",
    kind: "numberList",
  },
  { id: "queryWeatherScore", label: "Query weather score", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedAngerWeatherScores.forEach((v) =>
    positive(v, "callerMatchedAngerWeatherScores"),
  );
  positive(input.queryWeatherScore, "queryWeatherScore");
  input.callerVerifiedAngerRatings.forEach((v) =>
    positive(v, "callerVerifiedAngerRatings"),
  );
  const v = curve(
    input.callerMatchedAngerWeatherScores,
    input.callerVerifiedAngerRatings,
    input.queryWeatherScore,
  );
  return {
    callerInterpolatedAngerRating: v.value,
    localObservedSecantSlope: v.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedAngerWeatherScores: [1, 2, 3],
  callerVerifiedAngerRatings: [2, 4, 8],
  queryWeatherScore: 2.5,
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedAngerRating: 6,
  localObservedSecantSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/fire-danger-rating-anger",
  title: "Anger Fire Danger Rating Calculator",
  description:
    "Read independently validated Anger weather-score/rating calibration, no fabricated named fire-danger equation. Piecewise linear measured calibration only; no extrapolation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedAngerRating",
      label: "Caller interpolated anger rating",
      kind: "number",
    },
    {
      id: "localObservedSecantSlope",
      label: "Local observed secant slope",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedAngerWeatherScores:
        value.callerMatchedAngerWeatherScores as readonly number[],
      callerVerifiedAngerRatings:
        value.callerVerifiedAngerRatings as readonly number[],
      queryWeatherScore: value.queryWeatherScore as number,
    }),
});
export const run = tool.execute;
export default tool;
