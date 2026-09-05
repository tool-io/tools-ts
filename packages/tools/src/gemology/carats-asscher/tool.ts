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
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly asscherSideMm: number;
  readonly cornerClipFractionOfSide: number;
  readonly totalDepthMm: number;
  readonly callerAsscherStepCutFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "asscherSideMm", label: "Asscher side mm", kind: "number" },
  {
    id: "cornerClipFractionOfSide",
    label: "Corner clip fraction of side",
    kind: "number",
  },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerAsscherStepCutFillFraction",
    label: "Caller asscher step cut fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.asscherSideMm, "asscherSideMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  fraction(
    input.callerAsscherStepCutFillFraction,
    "callerAsscherStepCutFillFraction",
  );
  if (
    input.cornerClipFractionOfSide < 0 ||
    input.cornerClipFractionOfSide > 0.5
  )
    simpleError("corner", "0..0.5side45°clip.");
  const v =
    input.asscherSideMm ** 2 *
    (1 - 2 * input.cornerClipFractionOfSide ** 2) *
    input.totalDepthMm *
    input.callerAsscherStepCutFillFraction;
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
  asscherSideMm: 6,
  cornerClipFractionOfSide: 0.2,
  totalDepthMm: 4,
  callerAsscherStepCutFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 66.24,
  conditionalMassCarats: 1.3248,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-asscher",
  title: "Asscher Cut Carat Weight Estimator",
  description:
    "Asscher square octagonal outline with dimensionless corner cut and independently matched step-cut fill. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      asscherSideMm: value.asscherSideMm as number,
      cornerClipFractionOfSide: value.cornerClipFractionOfSide as number,
      totalDepthMm: value.totalDepthMm as number,
      callerAsscherStepCutFillFraction:
        value.callerAsscherStepCutFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
