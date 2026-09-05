import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly girdleDiameterMm: number;
  readonly totalDepthMm: number;
  readonly callerRoundBrilliantVolumeFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "girdleDiameterMm", label: "Girdle diameter mm", kind: "number" },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerRoundBrilliantVolumeFillFraction",
    label: "Caller round brilliant volume fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.girdleDiameterMm, "girdleDiameterMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  fraction(
    input.callerRoundBrilliantVolumeFillFraction,
    "callerRoundBrilliantVolumeFillFraction",
  );
  const v =
    ((Math.PI * input.girdleDiameterMm ** 2) / 4) *
    input.totalDepthMm *
    input.callerRoundBrilliantVolumeFillFraction;
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
  girdleDiameterMm: 10,
  totalDepthMm: 4,
  callerRoundBrilliantVolumeFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 157.07963267948966,
  conditionalMassCarats: 3.141592653589793,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-round-brilliant",
  title: "Round Brilliant Carat Weight Estimator",
  description:
    "Round-brilliant enclosing circular cylinder with independently calibrated physical cut-fill fraction. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      girdleDiameterMm: value.girdleDiameterMm as number,
      totalDepthMm: value.totalDepthMm as number,
      callerRoundBrilliantVolumeFillFraction:
        value.callerRoundBrilliantVolumeFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
