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
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly emeraldLengthMm: number;
  readonly emeraldWidthMm: number;
  readonly cornerClipMm: number;
  readonly totalDepthMm: number;
  readonly callerEmeraldDepthFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "emeraldLengthMm", label: "Emerald length mm", kind: "number" },
  { id: "emeraldWidthMm", label: "Emerald width mm", kind: "number" },
  { id: "cornerClipMm", label: "Corner clip mm", kind: "number" },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerEmeraldDepthFillFraction",
    label: "Caller emerald depth fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.emeraldLengthMm, "emeraldLengthMm");
  positive(input.emeraldWidthMm, "emeraldWidthMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  nonnegative(input.cornerClipMm, "cornerClipMm");
  fraction(
    input.callerEmeraldDepthFillFraction,
    "callerEmeraldDepthFillFraction",
  );
  if (
    2 * input.cornerClipMm >
    Math.min(input.emeraldLengthMm, input.emeraldWidthMm)
  )
    simpleError("corner", "Nonoverlapping45°corner clips.");
  const v =
    (input.emeraldLengthMm * input.emeraldWidthMm -
      2 * input.cornerClipMm ** 2) *
    input.totalDepthMm *
    input.callerEmeraldDepthFillFraction;
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
  emeraldLengthMm: 10,
  emeraldWidthMm: 6,
  cornerClipMm: 1,
  totalDepthMm: 4,
  callerEmeraldDepthFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 116,
  conditionalMassCarats: 2.32,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-emerald",
  title: "Emerald Cut Carat Weight Estimator",
  description:
    "Emerald-cut equal 45°corner-clipped rectangular outline with separately calibrated step-cut depth fill. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      emeraldLengthMm: value.emeraldLengthMm as number,
      emeraldWidthMm: value.emeraldWidthMm as number,
      cornerClipMm: value.cornerClipMm as number,
      totalDepthMm: value.totalDepthMm as number,
      callerEmeraldDepthFillFraction:
        value.callerEmeraldDepthFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
