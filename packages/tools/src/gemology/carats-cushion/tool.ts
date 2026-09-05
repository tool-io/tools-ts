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
  readonly cushionLengthMm: number;
  readonly cushionWidthMm: number;
  readonly roundedCornerRadiusMm: number;
  readonly totalDepthMm: number;
  readonly callerCushionVolumeFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "cushionLengthMm", label: "Cushion length mm", kind: "number" },
  { id: "cushionWidthMm", label: "Cushion width mm", kind: "number" },
  {
    id: "roundedCornerRadiusMm",
    label: "Rounded corner radius mm",
    kind: "number",
  },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerCushionVolumeFillFraction",
    label: "Caller cushion volume fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cushionLengthMm, "cushionLengthMm");
  positive(input.cushionWidthMm, "cushionWidthMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  nonnegative(input.roundedCornerRadiusMm, "roundedCornerRadiusMm");
  fraction(
    input.callerCushionVolumeFillFraction,
    "callerCushionVolumeFillFraction",
  );
  if (
    2 * input.roundedCornerRadiusMm >
    Math.min(input.cushionLengthMm, input.cushionWidthMm)
  )
    simpleError("corners", "Nonoverlapping rounded corners.");
  const v =
    (input.cushionLengthMm * input.cushionWidthMm -
      (4 - Math.PI) * input.roundedCornerRadiusMm ** 2) *
    input.totalDepthMm *
    input.callerCushionVolumeFillFraction;
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
  cushionLengthMm: 10,
  cushionWidthMm: 6,
  roundedCornerRadiusMm: 1,
  totalDepthMm: 4,
  callerCushionVolumeFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 118.2831853071796,
  conditionalMassCarats: 2.3656637061435917,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-cushion",
  title: "Cushion Cut Carat Weight Estimator",
  description:
    "Cushion rounded-rectangle outline with measured circular corner radius, not rectangular or oval substitution. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      cushionLengthMm: value.cushionLengthMm as number,
      cushionWidthMm: value.cushionWidthMm as number,
      roundedCornerRadiusMm: value.roundedCornerRadiusMm as number,
      totalDepthMm: value.totalDepthMm as number,
      callerCushionVolumeFillFraction:
        value.callerCushionVolumeFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
