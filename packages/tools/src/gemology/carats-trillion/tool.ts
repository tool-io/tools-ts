import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly trillionBaseMm: number;
  readonly trillionPerpendicularHeightMm: number;
  readonly totalDepthMm: number;
  readonly callerTrillionCutFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "trillionBaseMm", label: "Trillion base mm", kind: "number" },
  {
    id: "trillionPerpendicularHeightMm",
    label: "Trillion perpendicular height mm",
    kind: "number",
  },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerTrillionCutFillFraction",
    label: "Caller trillion cut fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.trillionBaseMm, "trillionBaseMm");
  positive(
    input.trillionPerpendicularHeightMm,
    "trillionPerpendicularHeightMm",
  );
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  fraction(
    input.callerTrillionCutFillFraction,
    "callerTrillionCutFillFraction",
  );
  const v =
    ((input.trillionBaseMm * input.trillionPerpendicularHeightMm) / 2) *
    input.totalDepthMm *
    input.callerTrillionCutFillFraction;
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
  trillionBaseMm: 6,
  trillionPerpendicularHeightMm: 5,
  totalDepthMm: 4,
  callerTrillionCutFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 30,
  conditionalMassCarats: 0.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-trillion",
  title: "Trillion Cut Carat Weight Estimator",
  description:
    "Trillion measured triangular base/perpendicular altitude envelope, no circular sides or equilateral assumption. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      trillionBaseMm: value.trillionBaseMm as number,
      trillionPerpendicularHeightMm:
        value.trillionPerpendicularHeightMm as number,
      totalDepthMm: value.totalDepthMm as number,
      callerTrillionCutFillFraction:
        value.callerTrillionCutFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
