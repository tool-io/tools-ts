import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly baguetteLengthMm: number;
  readonly firstEndWidthMm: number;
  readonly secondEndWidthMm: number;
  readonly totalDepthMm: number;
  readonly callerBaguetteStepCutFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "baguetteLengthMm", label: "Baguette length mm", kind: "number" },
  { id: "firstEndWidthMm", label: "First end width mm", kind: "number" },
  { id: "secondEndWidthMm", label: "Second end width mm", kind: "number" },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerBaguetteStepCutFillFraction",
    label: "Caller baguette step cut fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.baguetteLengthMm, "baguetteLengthMm");
  positive(input.firstEndWidthMm, "firstEndWidthMm");
  positive(input.secondEndWidthMm, "secondEndWidthMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  fraction(
    input.callerBaguetteStepCutFillFraction,
    "callerBaguetteStepCutFillFraction",
  );
  const v =
    ((input.baguetteLengthMm *
      (input.firstEndWidthMm + input.secondEndWidthMm)) /
      2) *
    input.totalDepthMm *
    input.callerBaguetteStepCutFillFraction;
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
  baguetteLengthMm: 10,
  firstEndWidthMm: 4,
  secondEndWidthMm: 6,
  totalDepthMm: 4,
  callerBaguetteStepCutFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 100,
  conditionalMassCarats: 2.0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-baguette",
  title: "Baguette Carat Weight Estimator",
  description:
    "Baguette tapered trapezoidal outline from two separately measured end widths and step-cut fill, not square/rectangle auto assumed. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      baguetteLengthMm: value.baguetteLengthMm as number,
      firstEndWidthMm: value.firstEndWidthMm as number,
      secondEndWidthMm: value.secondEndWidthMm as number,
      totalDepthMm: value.totalDepthMm as number,
      callerBaguetteStepCutFillFraction:
        value.callerBaguetteStepCutFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
