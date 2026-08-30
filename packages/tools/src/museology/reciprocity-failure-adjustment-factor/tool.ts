import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly exposureLux: readonly number[];
  readonly exposureHours: readonly number[];
  readonly referenceLux: number;
  readonly callerIntensityExponent: number;
}>;
export type Output = Readonly<{
  readonly reciprocityAdjustedEquivalentReferenceHours: number;
  readonly linearEquivalentReferenceHours: number;
  readonly nonlinearToLinearExposureFactor: number;
}>;
const inputFields = [
  { id: "exposureLux", label: "Exposure lux", kind: "numberList" },
  { id: "exposureHours", label: "Exposure hours", kind: "numberList" },
  { id: "referenceLux", label: "Reference lux", kind: "number" },
  {
    id: "callerIntensityExponent",
    label: "Caller intensity exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceLux, "referenceLux");
  positive(input.callerIntensityExponent, "callerIntensityExponent");
  input.exposureLux.forEach((v) => nonnegative(v, "exposureLux"));
  input.exposureHours.forEach((v) => nonnegative(v, "exposureHours"));
  aligned(input.exposureLux, input.exposureHours, "exposureLux");
  const linear = positive(
      input.exposureLux.reduce(
        (s, v, i) => s + (v / input.referenceLux) * input.exposureHours[i],
        0,
      ),
      "linearExposure",
    ),
    adjusted = input.exposureLux.reduce(
      (s, v, i) =>
        s +
        (v / input.referenceLux) ** input.callerIntensityExponent *
          input.exposureHours[i],
      0,
    );
  return {
    reciprocityAdjustedEquivalentReferenceHours: adjusted,
    linearEquivalentReferenceHours: linear,
    nonlinearToLinearExposureFactor: adjusted / linear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  exposureLux: [10, 100],
  exposureHours: [10, 1],
  referenceLux: 10,
  callerIntensityExponent: 0.5,
} satisfies Input;
export const exampleOutput = {
  reciprocityAdjustedEquivalentReferenceHours: 13.16227766016838,
  linearEquivalentReferenceHours: 20,
  nonlinearToLinearExposureFactor: 0.658113883008419,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/reciprocity-failure-adjustment-factor",
  title: "Reciprocity Law Failure Adjustment Factor Calculator",
  description:
    "Apply caller experimentally calibrated intensity exponent relative to reference illuminance, exposing nonlinear versus linear exposure; no universal reciprocity-failure exponent or damage prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "reciprocityAdjustedEquivalentReferenceHours",
      label: "Reciprocity adjusted equivalent reference hours",
      kind: "number",
    },
    {
      id: "linearEquivalentReferenceHours",
      label: "Linear equivalent reference hours",
      kind: "number",
    },
    {
      id: "nonlinearToLinearExposureFactor",
      label: "Nonlinear to linear exposure factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      exposureLux: value.exposureLux as readonly number[],
      exposureHours: value.exposureHours as readonly number[],
      referenceLux: value.referenceLux as number,
      callerIntensityExponent: value.callerIntensityExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
