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
  readonly heartTotalLengthMm: number;
  readonly heartWidthMm: number;
  readonly totalDepthMm: number;
  readonly callerHeartDepthFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "heartTotalLengthMm", label: "Heart total length mm", kind: "number" },
  { id: "heartWidthMm", label: "Heart width mm", kind: "number" },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerHeartDepthFillFraction",
    label: "Caller heart depth fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.heartTotalLengthMm, "heartTotalLengthMm");
  positive(input.heartWidthMm, "heartWidthMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  fraction(input.callerHeartDepthFillFraction, "callerHeartDepthFillFraction");
  if (input.heartTotalLengthMm <= input.heartWidthMm / 4)
    simpleError("point", "Positive triangular point height.");
  const v =
    ((Math.PI * input.heartWidthMm ** 2) / 16 +
      (input.heartWidthMm *
        (input.heartTotalLengthMm - input.heartWidthMm / 4)) /
        2) *
    input.totalDepthMm *
    input.callerHeartDepthFillFraction;
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
  heartTotalLengthMm: 10,
  heartWidthMm: 8,
  totalDepthMm: 4,
  callerHeartDepthFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 89.13274122871834,
  conditionalMassCarats: 1.782654824574367,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-heart-shape",
  title: "Heart Shape Carat Weight Estimator",
  description:
    "Ideal heart outline two semi circular lobes above triangular point, no cleft/cut shape correction inferred. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      heartTotalLengthMm: value.heartTotalLengthMm as number,
      heartWidthMm: value.heartWidthMm as number,
      totalDepthMm: value.totalDepthMm as number,
      callerHeartDepthFillFraction:
        value.callerHeartDepthFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
