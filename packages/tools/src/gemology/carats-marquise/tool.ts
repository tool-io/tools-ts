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
  readonly marquiseLengthMm: number;
  readonly marquiseWidthMm: number;
  readonly totalDepthMm: number;
  readonly callerMarquiseDepthFillFraction: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "marquiseLengthMm", label: "Marquise length mm", kind: "number" },
  { id: "marquiseWidthMm", label: "Marquise width mm", kind: "number" },
  { id: "totalDepthMm", label: "Total depth mm", kind: "number" },
  {
    id: "callerMarquiseDepthFillFraction",
    label: "Caller marquise depth fill fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.marquiseLengthMm, "marquiseLengthMm");
  positive(input.marquiseWidthMm, "marquiseWidthMm");
  positive(input.totalDepthMm, "totalDepthMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  fraction(
    input.callerMarquiseDepthFillFraction,
    "callerMarquiseDepthFillFraction",
  );
  if (input.marquiseWidthMm > input.marquiseLengthMm)
    simpleError("lens", "Short diagonal≤long.");
  const v = (() => {
    const r =
        (input.marquiseLengthMm ** 2 + input.marquiseWidthMm ** 2) /
        (4 * input.marquiseWidthMm),
      a = r - input.marquiseWidthMm / 2;
    return (
      (2 * r * r * Math.acos(a / r) -
        2 * a * Math.sqrt(Math.max(0, r * r - a * a))) *
      input.totalDepthMm *
      input.callerMarquiseDepthFillFraction
    );
  })();
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
  marquiseLengthMm: 10,
  marquiseWidthMm: 6,
  totalDepthMm: 4,
  callerMarquiseDepthFillFraction: 0.5,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 85.49443162506563,
  conditionalMassCarats: 1.7098886325013125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-marquise",
  title: "Marquise Carat Weight Estimator",
  description:
    "Marquise symmetric two circular arcs lens outline from independently measured long/short diagonals, not ellipse or triangle assumed. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      marquiseLengthMm: value.marquiseLengthMm as number,
      marquiseWidthMm: value.marquiseWidthMm as number,
      totalDepthMm: value.totalDepthMm as number,
      callerMarquiseDepthFillFraction:
        value.callerMarquiseDepthFillFraction as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
