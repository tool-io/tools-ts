import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly windStressPa: number;
  readonly windWorkVelocityMPerSecond: number;
  readonly durationSeconds: number;
  readonly mixingEfficiency: number;
  readonly waterDensityKgPerM3: number;
  readonly initialBuoyancyFrequencySquaredPerSecondSquared: number;
  readonly maximumWaterDepthM: number;
}>;
export type Output = Readonly<{
  readonly availableMixingEnergyJPerM2: number;
  readonly unboundedMixingDepthM: number;
  readonly depthLimitedMixingDepthM: number;
  readonly bottomLimited: boolean;
}>;
const inputFields = [
  { id: "windStressPa", label: "Wind stress pa", kind: "number" },
  {
    id: "windWorkVelocityMPerSecond",
    label: "Wind work velocity m per second",
    kind: "number",
  },
  { id: "durationSeconds", label: "Duration seconds", kind: "number" },
  { id: "mixingEfficiency", label: "Mixing efficiency", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "initialBuoyancyFrequencySquaredPerSecondSquared",
    label: "Initial buoyancy frequency squared per second squared",
    kind: "number",
  },
  { id: "maximumWaterDepthM", label: "Maximum water depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(
    input.initialBuoyancyFrequencySquaredPerSecondSquared,
    "initialBuoyancyFrequencySquaredPerSecondSquared",
  );
  positive(input.maximumWaterDepthM, "maximumWaterDepthM");
  nonnegative(input.windStressPa, "windStressPa");
  nonnegative(input.windWorkVelocityMPerSecond, "windWorkVelocityMPerSecond");
  nonnegative(input.durationSeconds, "durationSeconds");
  fraction(input.mixingEfficiency, "mixingEfficiency");
  const availableMixingEnergyJPerM2 =
      input.windStressPa *
      input.windWorkVelocityMPerSecond *
      input.durationSeconds *
      input.mixingEfficiency,
    unboundedMixingDepthM = Math.cbrt(
      (12 * availableMixingEnergyJPerM2) /
        (input.waterDensityKgPerM3 *
          input.initialBuoyancyFrequencySquaredPerSecondSquared),
    );
  return {
    availableMixingEnergyJPerM2,
    unboundedMixingDepthM,
    depthLimitedMixingDepthM: Math.min(
      unboundedMixingDepthM,
      input.maximumWaterDepthM,
    ),
    bottomLimited: unboundedMixingDepthM > input.maximumWaterDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  windStressPa: 1,
  windWorkVelocityMPerSecond: 1,
  durationSeconds: 1,
  mixingEfficiency: 1,
  waterDensityKgPerM3: 1000,
  initialBuoyancyFrequencySquaredPerSecondSquared: 0.012,
  maximumWaterDepthM: 2,
} satisfies Input;
export const exampleOutput = {
  availableMixingEnergyJPerM2: 1,
  unboundedMixingDepthM: 1,
  depthLimitedMixingDepthM: 1,
  bottomLimited: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/wind-stress-mixing-depth-estimate",
  title: "Wind Stress Mixing Depth Estimate",
  description:
    "Screen mixing depth by supplied useful wind work against the rho·N²·h³/12 energy of uniform linear stratification; wind-work velocity/efficiency require calibration, not universal turbulent mixing.",
  inputs: inputFields,
  outputs: [
    {
      id: "availableMixingEnergyJPerM2",
      label: "Available mixing energy j per m2",
      kind: "number",
    },
    {
      id: "unboundedMixingDepthM",
      label: "Unbounded mixing depth m",
      kind: "number",
    },
    {
      id: "depthLimitedMixingDepthM",
      label: "Depth limited mixing depth m",
      kind: "number",
    },
    { id: "bottomLimited", label: "Bottom limited", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      windStressPa: value.windStressPa as number,
      windWorkVelocityMPerSecond: value.windWorkVelocityMPerSecond as number,
      durationSeconds: value.durationSeconds as number,
      mixingEfficiency: value.mixingEfficiency as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      initialBuoyancyFrequencySquaredPerSecondSquared:
        value.initialBuoyancyFrequencySquaredPerSecondSquared as number,
      maximumWaterDepthM: value.maximumWaterDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
