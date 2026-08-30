import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly samplePowerWatts: number;
  readonly referencePowerWatts: number;
  readonly calibrationFactor: number;
}>;
export type Output = Readonly<{
  readonly calibratedTapRatio: number;
  readonly sampleSharePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.referencePowerWatts <= 0)
    simpleError(
      "referencePowerWatts",
      "Reference power must be positive.",
      "invalid_reference",
    );
  const calibratedTapRatio =
    (input.samplePowerWatts / input.referencePowerWatts) *
    input.calibrationFactor;
  const total = input.samplePowerWatts + input.referencePowerWatts;
  return {
    calibratedTapRatio,
    sampleSharePercent:
      total === 0 ? 0 : (input.samplePowerWatts / total) * 100,
  };
};

export const exampleInput = {
  samplePowerWatts: 2,
  referencePowerWatts: 8,
  calibrationFactor: 1,
} satisfies Input;
export const exampleOutput = {
  calibratedTapRatio: 0.25,
  sampleSharePercent: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      samplePowerWatts: input.samplePowerWatts as number,
      referencePowerWatts: input.referencePowerWatts as number,
      calibrationFactor: input.calibrationFactor as number,
    }),
  description:
    "Calculate calibrated beam-monitor tap ratio and measured sample share.",
  id: "laser/beam-tap-ratio",
  inputs: [
    {
      id: "samplePowerWatts",
      label: "Sample tap power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "referencePowerWatts",
      label: "Reference power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "calibrationFactor",
      label: "Tap calibration factor",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "calibratedTapRatio",
      label: "Calibrated sample/reference ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "sampleSharePercent",
      label: "Sample share of measured total",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Beam-Tap Ratio",
});

export const run = tool.execute;
export default tool;
