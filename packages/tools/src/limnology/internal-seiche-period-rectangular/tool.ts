import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly lakeLengthM: number;
  readonly upperLayerDepthM: number;
  readonly lowerLayerDepthM: number;
  readonly densityContrastKgPerM3: number;
  readonly referenceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly internalWaveSpeedMPerSecond: number;
  readonly fundamentalSeichePeriodSeconds: number;
}>;
const inputFields = [
  { id: "lakeLengthM", label: "Lake length m", kind: "number" },
  { id: "upperLayerDepthM", label: "Upper layer depth m", kind: "number" },
  { id: "lowerLayerDepthM", label: "Lower layer depth m", kind: "number" },
  {
    id: "densityContrastKgPerM3",
    label: "Density contrast kg per m3",
    kind: "number",
  },
  {
    id: "referenceDensityKgPerM3",
    label: "Reference density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lakeLengthM, "lakeLengthM");
  positive(input.upperLayerDepthM, "upperLayerDepthM");
  positive(input.lowerLayerDepthM, "lowerLayerDepthM");
  positive(input.densityContrastKgPerM3, "densityContrastKgPerM3");
  positive(input.referenceDensityKgPerM3, "referenceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  const internalWaveSpeedMPerSecond = Math.sqrt(
    (((input.gravityMPerSecondSquared * input.densityContrastKgPerM3) /
      input.referenceDensityKgPerM3) *
      input.upperLayerDepthM *
      input.lowerLayerDepthM) /
      (input.upperLayerDepthM + input.lowerLayerDepthM),
  );
  return {
    internalWaveSpeedMPerSecond,
    fundamentalSeichePeriodSeconds:
      (2 * input.lakeLengthM) / positive(internalWaveSpeedMPerSecond, "model"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lakeLengthM: 1000,
  upperLayerDepthM: 10,
  lowerLayerDepthM: 10,
  densityContrastKgPerM3: 2,
  referenceDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  internalWaveSpeedMPerSecond: 0.31622776601683794,
  fundamentalSeichePeriodSeconds: 6324.555320336759,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/internal-seiche-period-rectangular",
  title: "Internal Seiche Period Rectangular",
  description:
    "Estimate the fundamental rectangular nonrotating two-layer internal seiche period 2L/c; higher harmonics are excluded as duplicated scaling variants.",
  inputs: inputFields,
  outputs: [
    {
      id: "internalWaveSpeedMPerSecond",
      label: "Internal wave speed m per second",
      kind: "number",
    },
    {
      id: "fundamentalSeichePeriodSeconds",
      label: "Fundamental seiche period seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lakeLengthM: value.lakeLengthM as number,
      upperLayerDepthM: value.upperLayerDepthM as number,
      lowerLayerDepthM: value.lowerLayerDepthM as number,
      densityContrastKgPerM3: value.densityContrastKgPerM3 as number,
      referenceDensityKgPerM3: value.referenceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
