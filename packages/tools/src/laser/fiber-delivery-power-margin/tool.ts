import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly deliveredPowerWatts: number;
  readonly coreAreaSquareMeters: number;
  readonly damageIntensityWPerM2: number;
  readonly nonlinearCoefficientPerWMeter: number;
  readonly fiberLengthMeters: number;
  readonly maximumBIntegralRadians: number;
}>;
export type Output = Readonly<{
  readonly coreIntensityWPerM2: number;
  readonly damageMargin: number;
  readonly bIntegralRadians: number;
  readonly withinBothLimits: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.coreAreaSquareMeters <= 0 || input.damageIntensityWPerM2 <= 0)
    simpleError(
      "coreAreaSquareMeters",
      "Core area and damage limit must be positive.",
      "invalid_limits",
    );
  const coreIntensityWPerM2 =
    input.deliveredPowerWatts / input.coreAreaSquareMeters;
  const bIntegralRadians =
    input.nonlinearCoefficientPerWMeter *
    input.deliveredPowerWatts *
    input.fiberLengthMeters;
  return {
    coreIntensityWPerM2,
    damageMargin: input.damageIntensityWPerM2 / coreIntensityWPerM2,
    bIntegralRadians,
    withinBothLimits:
      coreIntensityWPerM2 <= input.damageIntensityWPerM2 &&
      bIntegralRadians <= input.maximumBIntegralRadians,
  };
};

export const exampleInput = {
  deliveredPowerWatts: 10,
  coreAreaSquareMeters: 0.01,
  damageIntensityWPerM2: 2000,
  nonlinearCoefficientPerWMeter: 0.01,
  fiberLengthMeters: 2,
  maximumBIntegralRadians: 1,
} satisfies Input;
export const exampleOutput = {
  coreIntensityWPerM2: 1000,
  damageMargin: 2,
  bIntegralRadians: 0.2,
  withinBothLimits: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      deliveredPowerWatts: input.deliveredPowerWatts as number,
      coreAreaSquareMeters: input.coreAreaSquareMeters as number,
      damageIntensityWPerM2: input.damageIntensityWPerM2 as number,
      nonlinearCoefficientPerWMeter:
        input.nonlinearCoefficientPerWMeter as number,
      fiberLengthMeters: input.fiberLengthMeters as number,
      maximumBIntegralRadians: input.maximumBIntegralRadians as number,
    }),
  description:
    "Check fiber-delivery intensity and nonlinear phase against supplied limits.",
  id: "laser/fiber-delivery-power-margin",
  inputs: [
    {
      id: "deliveredPowerWatts",
      label: "Delivered peak power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "coreAreaSquareMeters",
      label: "Fiber core area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "damageIntensityWPerM2",
      label: "Damage intensity limit",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
    {
      id: "nonlinearCoefficientPerWMeter",
      label: "Nonlinear coefficient",
      kind: "number",
      minimum: 0,
      unit: "1/(W·m)",
    },
    {
      id: "fiberLengthMeters",
      label: "Fiber length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "maximumBIntegralRadians",
      label: "Maximum B-integral",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
  ],
  outputs: [
    {
      id: "coreIntensityWPerM2",
      label: "Core intensity",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
    {
      id: "damageMargin",
      label: "Damage-threshold ratio margin",
      kind: "number",
    },
    {
      id: "bIntegralRadians",
      label: "Nonlinear B-integral",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
    {
      id: "withinBothLimits",
      label: "Within damage and nonlinear limits",
      kind: "boolean",
    },
  ],
  title: "Fiber Delivery Power Margin",
});

export const run = tool.execute;
export default tool;
