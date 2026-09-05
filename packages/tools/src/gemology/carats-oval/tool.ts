import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly ovalLengthMm: number;
  readonly ovalWidthMm: number;
  readonly totalDepthMm: number;
  readonly callerOvalCutVolumeFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "ovalLengthMm", label: "Oval length mm", kind: "number" },
  { id: "ovalWidthMm", label: "Oval width mm", kind: "number" },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerOvalCutVolumeFillFraction",
    label: "Caller oval cut volume fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.ovalLengthMm, "ovalLengthMm");
  positive(input.ovalWidthMm, "ovalWidthMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  fraction(
    input.callerOvalCutVolumeFillFraction,
    "callerOvalCutVolumeFillFraction",
  );
  const v =
    ((Math.PI * input.ovalLengthMm * input.ovalWidthMm) / 4) *
    input.totalDepthMm *
    input.callerOvalCutVolumeFillFraction;
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
  ovalLengthMm: 10,
  ovalWidthMm: 6,
  totalDepthMm: 4,
  callerOvalCutVolumeFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 94.24777960769379,
  conditionalMassCarats: 1.8849555921538756,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-oval",
  title: "Oval Cut Carat Weight Estimator",
  description:
    "Oval-cut elliptical-cylinder envelope with independently calibrated depth-volume fill. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      ovalLengthMm: value.ovalLengthMm as number,
      ovalWidthMm: value.ovalWidthMm as number,
      totalDepthMm: value.totalDepthMm as number,
      callerOvalCutVolumeFillFraction:
        value.callerOvalCutVolumeFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
