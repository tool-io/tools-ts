import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly sampleCoordinates: readonly number[];
  readonly evenLineReal: readonly number[];
  readonly evenLineImaginary: readonly number[];
  readonly phaseInterceptRadians: number;
  readonly phaseSlopeRadiansPerCoordinate: number;
}>;
export type Output = Readonly<{
  readonly correctedReal: readonly number[];
  readonly correctedImaginary: readonly number[];
}>;
const inputFields = [
  { id: "sampleCoordinates", label: "Sample coordinates", kind: "numberList" },
  { id: "evenLineReal", label: "Even line real", kind: "numberList" },
  { id: "evenLineImaginary", label: "Even line imaginary", kind: "numberList" },
  {
    id: "phaseInterceptRadians",
    label: "Phase intercept radians",
    kind: "number",
  },
  {
    id: "phaseSlopeRadiansPerCoordinate",
    label: "Phase slope radians per coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.sampleCoordinates, input.evenLineReal, "sampleCoordinates");
  aligned(
    input.sampleCoordinates,
    input.evenLineImaginary,
    "sampleCoordinates",
  );
  const phase = input.sampleCoordinates.map(
    (x) =>
      input.phaseInterceptRadians + input.phaseSlopeRadiansPerCoordinate * x,
  );
  return {
    correctedReal: phase.map(
      (p, i) =>
        input.evenLineReal[i] * Math.cos(p) +
        input.evenLineImaginary[i] * Math.sin(p),
    ),
    correctedImaginary: phase.map(
      (p, i) =>
        input.evenLineImaginary[i] * Math.cos(p) -
        input.evenLineReal[i] * Math.sin(p),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleCoordinates: [-1, 0, 1],
  evenLineReal: [1, 1, 1],
  evenLineImaginary: [0, 0, 0],
  phaseInterceptRadians: 1.5707963267948966,
  phaseSlopeRadiansPerCoordinate: 0,
} satisfies Input;
export const exampleOutput = {
  correctedReal: [0, 0, 0],
  correctedImaginary: [-1, -1, -1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/epi-odd-even-phase-correction",
  title: "Nyquist Ghost Correction",
  description:
    "Apply supplied linear odd/even phase calibration exp(−i(a+bx)) to an even EPI line; calibration estimation, timing correction and ghost removal efficacy are not inferred.",
  inputs: inputFields,
  outputs: [
    { id: "correctedReal", label: "Corrected real", kind: "numberList" },
    {
      id: "correctedImaginary",
      label: "Corrected imaginary",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleCoordinates: value.sampleCoordinates as readonly number[],
      evenLineReal: value.evenLineReal as readonly number[],
      evenLineImaginary: value.evenLineImaginary as readonly number[],
      phaseInterceptRadians: value.phaseInterceptRadians as number,
      phaseSlopeRadiansPerCoordinate:
        value.phaseSlopeRadiansPerCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
