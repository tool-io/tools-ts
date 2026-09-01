import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  bounded,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPoints: number;
  readonly observedFieldGoalAttempts: number;
  readonly observedFreeThrowAttempts: number;
  readonly callerFreeThrowPossessionWeight: number;
}>;
export type Output = Readonly<{ readonly modeledTrueShootingPercent: number }>;
const inputFields = [
  { id: "observedPoints", label: "Observed points", kind: "number" },
  {
    id: "observedFieldGoalAttempts",
    label: "Observed field goal attempts",
    kind: "number",
  },
  {
    id: "observedFreeThrowAttempts",
    label: "Observed free throw attempts",
    kind: "number",
  },
  {
    id: "callerFreeThrowPossessionWeight",
    label: "Caller free throw possession weight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedPoints, "points", 0, 1000000);
  bounded(input.observedFieldGoalAttempts, "attempts", 0, 1000000);
  bounded(input.observedFreeThrowAttempts, "ft", 0, 1000000);
  fraction(input.callerFreeThrowPossessionWeight, "weight");
  const denominator =
    2 *
    (input.observedFieldGoalAttempts +
      input.callerFreeThrowPossessionWeight * input.observedFreeThrowAttempts);
  positive(denominator, "attemptEquivalents");
  return {
    modeledTrueShootingPercent: (100 * input.observedPoints) / denominator,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPoints: 30,
  observedFieldGoalAttempts: 20,
  observedFreeThrowAttempts: 10,
  callerFreeThrowPossessionWeight: 0.44,
} satisfies Input;
export const exampleOutput = {
  modeledTrueShootingPercent: 61.47540983606558,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/basketball-true-shooting-percent-tsx",
  title: "Basketball True Shooting % Calculator",
  description:
    "Compute observed basketball points per two weighted shot-attempt equivalents under caller FT weight; approximation not exact possession tracking or eFG.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledTrueShootingPercent",
      label: "Modeled true shooting percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPoints: value.observedPoints as number,
      observedFieldGoalAttempts: value.observedFieldGoalAttempts as number,
      observedFreeThrowAttempts: value.observedFreeThrowAttempts as number,
      callerFreeThrowPossessionWeight:
        value.callerFreeThrowPossessionWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
