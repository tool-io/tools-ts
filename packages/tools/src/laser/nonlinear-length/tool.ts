import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nonlinearCoefficientPerWattMeter: number;
  readonly peakPowerWatts: number;
  readonly propagationLengthMeters: number;
}>;
export type Output = Readonly<{
  readonly nonlinearLengthMeters: number;
  readonly nonlinearPhaseRadians: number;
}>;

export const calculate = (input: Input): Output => {
  const product = input.nonlinearCoefficientPerWattMeter * input.peakPowerWatts;
  if (product <= 0)
    simpleError(
      "nonlinearCoefficientPerWattMeter",
      "Coefficient and peak power product must be positive.",
      "invalid_product",
    );
  return {
    nonlinearLengthMeters: 1 / product,
    nonlinearPhaseRadians: product * input.propagationLengthMeters,
  };
};

export const exampleInput = {
  nonlinearCoefficientPerWattMeter: 2,
  peakPowerWatts: 10,
  propagationLengthMeters: 0.1,
} satisfies Input;
export const exampleOutput = {
  nonlinearLengthMeters: 0.05,
  nonlinearPhaseRadians: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nonlinearCoefficientPerWattMeter:
        input.nonlinearCoefficientPerWattMeter as number,
      peakPowerWatts: input.peakPowerWatts as number,
      propagationLengthMeters: input.propagationLengthMeters as number,
    }),
  description:
    "Calculate nonlinear length and accumulated self-phase modulation.",
  id: "laser/nonlinear-length",
  inputs: [
    {
      id: "nonlinearCoefficientPerWattMeter",
      label: "Nonlinear coefficient",
      kind: "number",
      minimum: 0,
      unit: "1/(W·m)",
    },
    {
      id: "peakPowerWatts",
      label: "Peak power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "propagationLengthMeters",
      label: "Propagation length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "nonlinearLengthMeters",
      label: "Nonlinear length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "nonlinearPhaseRadians",
      label: "Nonlinear phase",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
  ],
  title: "Nonlinear Length",
});

export const run = tool.execute;
export default tool;
