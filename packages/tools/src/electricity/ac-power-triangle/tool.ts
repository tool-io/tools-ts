import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AcPowerTriangleInput = {
  readonly powerFactor: number;
  readonly realPowerWatts: number;
  readonly reactiveMode: "lagging" | "leading";
};

export type AcPowerTriangleOutput = {
  readonly apparentPowerVoltAmperes: number;
  readonly phaseAngleDegrees: number;
  readonly reactivePowerVoltAmperesReactive: number;
};

export const calculateAcPowerTriangle = (
  input: AcPowerTriangleInput,
): AcPowerTriangleOutput => {
  if (!(input.powerFactor > 0 && input.powerFactor <= 1))
    simpleError(
      "powerFactor",
      "Power factor must be greater than zero and at most one.",
      "power_factor_out_of_range",
    );
  const direction = input.reactiveMode === "leading" ? -1 : 1;
  const apparentPowerVoltAmperes = input.realPowerWatts / input.powerFactor;
  const reactivePowerVoltAmperesReactive =
    direction *
    Math.sqrt(
      Math.max(0, apparentPowerVoltAmperes ** 2 - input.realPowerWatts ** 2),
    );
  const phaseAngleDegrees =
    (direction * (Math.acos(input.powerFactor) * 180)) / Math.PI;
  return {
    apparentPowerVoltAmperes,
    phaseAngleDegrees,
    reactivePowerVoltAmperesReactive,
  };
};

export const acPowerTriangleExample = {
  input: {
    powerFactor: 0.8,
    reactiveMode: "lagging" as const,
    realPowerWatts: 800,
  },
  output: {
    apparentPowerVoltAmperes: 1_000,
    phaseAngleDegrees: 36.86989764584401,
    reactivePowerVoltAmperesReactive: 600,
  },
} satisfies ToolExample<AcPowerTriangleInput, AcPowerTriangleOutput>;

export const acPowerTriangleTool = createSimpleTool({
  calculate: (input) =>
    calculateAcPowerTriangle({
      powerFactor: input.powerFactor as number,
      reactiveMode: input.reactiveMode as "lagging" | "leading",
      realPowerWatts: input.realPowerWatts as number,
    }),
  description:
    "Derive apparent power, signed reactive power, and phase angle from nonnegative real power and a leading or lagging power factor.",
  id: "electricity/ac-power-triangle",
  inputs: [
    {
      id: "realPowerWatts",
      kind: "number",
      label: "Real power",
      minimum: 0,
      unit: "W",
    },
    {
      description: "Magnitude greater than zero and at most one.",
      id: "powerFactor",
      kind: "number",
      label: "Power factor",
      maximum: 1,
      minimum: 0,
    },
    {
      enum: ["lagging", "leading"],
      id: "reactiveMode",
      kind: "string",
      label: "Reactive mode",
    },
  ],
  outputs: [
    {
      id: "apparentPowerVoltAmperes",
      kind: "number",
      label: "Apparent power",
      unit: "VA",
    },
    {
      description: "Positive for lagging and negative for leading loads.",
      id: "reactivePowerVoltAmperesReactive",
      kind: "number",
      label: "Reactive power",
      unit: "var",
    },
    {
      description: "Positive for lagging and negative for leading loads.",
      id: "phaseAngleDegrees",
      kind: "number",
      label: "Phase angle",
      unit: "°",
    },
  ],
  title: "AC Power Triangle Calculator",
});

export const runAcPowerTriangle = acPowerTriangleTool.execute;
export default acPowerTriangleTool;
