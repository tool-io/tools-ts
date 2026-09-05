import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly pearLengthMm: number;
  readonly pearWidthMm: number;
  readonly callerRoundedLobeLengthFraction: number;
  readonly totalDepthMm: number;
  readonly callerPearDepthFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "pearLengthMm", label: "Pear length mm", kind: "number" },
  { id: "pearWidthMm", label: "Pear width mm", kind: "number" },
  {
    id: "callerRoundedLobeLengthFraction",
    label: "Caller rounded lobe length fraction",
    kind: "number",
  },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerPearDepthFillFraction",
    label: "Caller pear depth fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.pearLengthMm, "pearLengthMm");
  positive(input.pearWidthMm, "pearWidthMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  fraction(
    input.callerRoundedLobeLengthFraction,
    "callerRoundedLobeLengthFraction",
  );
  fraction(input.callerPearDepthFillFraction, "callerPearDepthFillFraction");
  const v =
    ((Math.PI *
      input.pearWidthMm *
      input.pearLengthMm *
      input.callerRoundedLobeLengthFraction) /
      4 +
      (input.pearWidthMm *
        input.pearLengthMm *
        (1 - input.callerRoundedLobeLengthFraction)) /
        2) *
    input.totalDepthMm *
    input.callerPearDepthFillFraction;
  return {
    conditionalEnvelopeVolumeMM3: v,
    conditionalMassCarats: (v * input.independentlyMeasuredDensityGCM3) / 200,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pearLengthMm: 10,
  pearWidthMm: 6,
  callerRoundedLobeLengthFraction: 0.5,
  totalDepthMm: 4,
  callerPearDepthFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 77.1238898038469,
  conditionalMassCarats: 1.5424777960769378,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-pear",
  title: "Pear Shape Carat Weight Estimator",
  description:
    "Pear outline piecewise halfellipse of specified lobe length joined to triangular point; no full oval replacement. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalEnvelopeVolumeMM3",
      label: "Conditional envelope volume m m3",
      kind: "number",
    },
    {
      id: "conditionalMassCarats",
      label: "Conditional mass carats",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pearLengthMm: value.pearLengthMm as number,
      pearWidthMm: value.pearWidthMm as number,
      callerRoundedLobeLengthFraction:
        value.callerRoundedLobeLengthFraction as number,
      totalDepthMm: value.totalDepthMm as number,
      callerPearDepthFillFraction: value.callerPearDepthFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
