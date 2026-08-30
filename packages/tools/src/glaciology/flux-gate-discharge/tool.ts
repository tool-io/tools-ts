import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly gateWidthsM: readonly number[];
  readonly iceThicknessesM: readonly number[];
  readonly surfaceSpeedsMPerYear: readonly number[];
  readonly anglesFromGateNormalDegrees: readonly number[];
  readonly depthMeanSurfaceVelocityRatios: readonly number[];
}>;
export type Output = Readonly<{
  readonly segmentIceFluxesM3PerYear: readonly number[];
  readonly totalIceFluxM3PerYear: number;
}>;
const inputFields = [
  { id: "gateWidthsM", label: "Gate widths m", kind: "numberList" },
  { id: "iceThicknessesM", label: "Ice thicknesses m", kind: "numberList" },
  {
    id: "surfaceSpeedsMPerYear",
    label: "Surface speeds m per year",
    kind: "numberList",
  },
  {
    id: "anglesFromGateNormalDegrees",
    label: "Angles from gate normal degrees",
    kind: "numberList",
  },
  {
    id: "depthMeanSurfaceVelocityRatios",
    label: "Depth mean surface velocity ratios",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.gateWidthsM.forEach((v) => positive(v, "gateWidthsM"));
  input.iceThicknessesM.forEach((v) => nonnegative(v, "iceThicknessesM"));
  input.surfaceSpeedsMPerYear.forEach((v) =>
    nonnegative(v, "surfaceSpeedsMPerYear"),
  );
  input.depthMeanSurfaceVelocityRatios.forEach((v) =>
    nonnegative(v, "depthMeanSurfaceVelocityRatios"),
  );
  aligned(input.gateWidthsM, input.iceThicknessesM, "gateWidthsM");
  aligned(input.gateWidthsM, input.surfaceSpeedsMPerYear, "gateWidthsM");
  aligned(input.gateWidthsM, input.anglesFromGateNormalDegrees, "gateWidthsM");
  aligned(
    input.gateWidthsM,
    input.depthMeanSurfaceVelocityRatios,
    "gateWidthsM",
  );
  const segmentIceFluxesM3PerYear = input.gateWidthsM.map(
    (v, i) =>
      v *
      input.iceThicknessesM[i] *
      input.surfaceSpeedsMPerYear[i] *
      input.depthMeanSurfaceVelocityRatios[i] *
      Math.cos((input.anglesFromGateNormalDegrees[i] * Math.PI) / 180),
  );
  return {
    segmentIceFluxesM3PerYear,
    totalIceFluxM3PerYear: segmentIceFluxesM3PerYear.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  gateWidthsM: [10, 20],
  iceThicknessesM: [100, 50],
  surfaceSpeedsMPerYear: [20, 10],
  anglesFromGateNormalDegrees: [0, 60],
  depthMeanSurfaceVelocityRatios: [0.8, 1],
} satisfies Input;
export const exampleOutput = {
  segmentIceFluxesM3PerYear: [16000, 5000],
  totalIceFluxM3PerYear: 21000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/flux-gate-discharge",
  title: "Flux Gate Discharge",
  description:
    "Integrate signed normal ice flux over supplied gate strips with depth-mean/surface velocity calibration; widths are physical section measurements, not geodesy coordinates.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentIceFluxesM3PerYear",
      label: "Segment ice fluxes m3 per year",
      kind: "numberList",
    },
    {
      id: "totalIceFluxM3PerYear",
      label: "Total ice flux m3 per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      gateWidthsM: value.gateWidthsM as readonly number[],
      iceThicknessesM: value.iceThicknessesM as readonly number[],
      surfaceSpeedsMPerYear: value.surfaceSpeedsMPerYear as readonly number[],
      anglesFromGateNormalDegrees:
        value.anglesFromGateNormalDegrees as readonly number[],
      depthMeanSurfaceVelocityRatios:
        value.depthMeanSurfaceVelocityRatios as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
