import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly beachSlopeTangent: number;
  readonly deepWaterWaveHeightM: number;
  readonly wavePeriodSeconds: number;
  readonly gravityMPerSecondSquared: number;
  readonly callerTransitionBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly iribarrenNumber: number;
  readonly callerRegimeCode: number;
}>;
const inputFields = [
  { id: "beachSlopeTangent", label: "Beach slope tangent", kind: "number" },
  {
    id: "deepWaterWaveHeightM",
    label: "Deep water wave height m",
    kind: "number",
  },
  { id: "wavePeriodSeconds", label: "Wave period seconds", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "callerTransitionBounds",
    label: "Caller transition bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.deepWaterWaveHeightM, "deepWaterWaveHeightM");
  positive(input.wavePeriodSeconds, "wavePeriodSeconds");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.callerTransitionBounds.forEach((v) =>
    positive(v, "callerTransitionBounds"),
  );
  nonnegative(input.beachSlopeTangent, "beachSlopeTangent");
  if (
    input.callerTransitionBounds.length !== 2 ||
    input.callerTransitionBounds[0] >= input.callerTransitionBounds[1]
  )
    simpleError(
      "callerTransitionBounds",
      "Two increasing caller thresholds required.",
    );
  const L =
      (input.gravityMPerSecondSquared * input.wavePeriodSeconds ** 2) /
      (2 * Math.PI),
    iribarrenNumber =
      input.beachSlopeTangent / Math.sqrt(input.deepWaterWaveHeightM / L);
  return {
    iribarrenNumber,
    callerRegimeCode:
      iribarrenNumber < input.callerTransitionBounds[0]
        ? 0
        : iribarrenNumber < input.callerTransitionBounds[1]
          ? 1
          : 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  beachSlopeTangent: 0.1,
  deepWaterWaveHeightM: 1,
  wavePeriodSeconds: 6.283185307179586,
  gravityMPerSecondSquared: 1,
  callerTransitionBounds: [0.1, 1],
} satisfies Input;
export const exampleOutput = {
  iribarrenNumber: 0.25066282746310004,
  callerRegimeCode: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/surf-similarity-iribarren-number",
  title: "Surf Similarity Iribarren Number",
  description:
    "Calculate deep-water surf similarity and caller regime bands, with upper band including equality; not a beach safety classification or universal breaker threshold.",
  inputs: inputFields,
  outputs: [
    { id: "iribarrenNumber", label: "Iribarren number", kind: "number" },
    { id: "callerRegimeCode", label: "Caller regime code", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      beachSlopeTangent: value.beachSlopeTangent as number,
      deepWaterWaveHeightM: value.deepWaterWaveHeightM as number,
      wavePeriodSeconds: value.wavePeriodSeconds as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      callerTransitionBounds: value.callerTransitionBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
