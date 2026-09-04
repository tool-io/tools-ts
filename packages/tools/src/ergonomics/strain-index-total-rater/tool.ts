import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  finite,
  ordered,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly sixIndependentStrainMultipliers: readonly number[];
  readonly callerLowBoundary: number;
  readonly callerHighBoundary: number;
}>;
export type Output = Readonly<{
  readonly strainIndex: number;
  readonly callerBand: string;
}>;
const inputFields = [
  {
    id: "sixIndependentStrainMultipliers",
    label: "Six independent strain multipliers",
    kind: "numberList",
  },
  { id: "callerLowBoundary", label: "Caller low boundary", kind: "number" },
  { id: "callerHighBoundary", label: "Caller high boundary", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sixIndependentStrainMultipliers.forEach((v) =>
    positive(v, "sixIndependentStrainMultipliers"),
  );
  nonnegative(input.callerLowBoundary, "callerLowBoundary");
  nonnegative(input.callerHighBoundary, "callerHighBoundary");
  if (input.sixIndependentStrainMultipliers.length !== 6)
    simpleError(
      "factors",
      "Six independent intensity/duration/frequency/posture/speed/daily-duration multipliers.",
    );
  ordered(input.callerLowBoundary, input.callerHighBoundary);
  const s = input.sixIndependentStrainMultipliers.reduce(
    (a, v) => finite(a * v),
    1,
  );
  return {
    strainIndex: s,
    callerBand:
      s <= input.callerLowBoundary
        ? "low"
        : s > input.callerHighBoundary
          ? "high"
          : "intermediate",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sixIndependentStrainMultipliers: [1, 2, 1, 1, 1, 1],
  callerLowBoundary: 1,
  callerHighBoundary: 3,
} satisfies Input;
export const exampleOutput = {
  strainIndex: 2,
  callerBand: "intermediate",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/strain-index-total-rater",
  title: "Strain Index Total Multiplied Score Rater",
  description:
    "Original six-factor StrainIndex product with independently edition-matched factors and explicit risk-screen bands, not medical risk estimate. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "strainIndex", label: "Strain index", kind: "number" },
    { id: "callerBand", label: "Caller band", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      sixIndependentStrainMultipliers:
        value.sixIndependentStrainMultipliers as readonly number[],
      callerLowBoundary: value.callerLowBoundary as number,
      callerHighBoundary: value.callerHighBoundary as number,
    }),
});
export const run = tool.execute;
export default tool;
