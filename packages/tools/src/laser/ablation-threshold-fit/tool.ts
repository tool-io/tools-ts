import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pulseEnergies: readonly number[];
  readonly squaredRadii: readonly number[];
}>;
export type Output = Readonly<{
  readonly thresholdEnergy: number;
  readonly beamRadius: number;
  readonly slope: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.pulseEnergies.length;
  if (
    n < 2 ||
    input.squaredRadii.length !== n ||
    input.pulseEnergies.some((value) => value <= 0)
  )
    simpleError(
      "pulseEnergies",
      "Aligned positive energies and radii need at least two samples.",
      "invalid_samples",
    );
  const x = input.pulseEnergies.map(Math.log),
    y = input.squaredRadii;
  const mx = x.reduce((a, b) => a + b, 0) / n,
    my = y.reduce((a, b) => a + b, 0) / n;
  const denominator = x.reduce((sum, value) => sum + (value - mx) ** 2, 0);
  if (denominator === 0)
    simpleError(
      "pulseEnergies",
      "Pulse energies need variation.",
      "singular_fit",
    );
  const slope =
    x.reduce((sum, value, index) => sum + (value - mx) * (y[index] - my), 0) /
    denominator;
  if (slope <= 0)
    simpleError("squaredRadii", "Fit slope must be positive.", "invalid_slope");
  const intercept = my - slope * mx;
  return {
    thresholdEnergy: Math.exp(-intercept / slope),
    beamRadius: Math.sqrt(2 * slope),
    slope,
  };
};

export const exampleInput = {
  pulseEnergies: [1, 2.718281828459045],
  squaredRadii: [0, 1],
} satisfies Input;
export const exampleOutput = {
  thresholdEnergy: 1,
  beamRadius: 1.4142135623730951,
  slope: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pulseEnergies: input.pulseEnergies as readonly number[],
      squaredRadii: input.squaredRadii as readonly number[],
    }),
  description:
    "Fit a Liu ablation-threshold line from pulse energy and squared crater radius.",
  id: "laser/ablation-threshold-fit",
  inputs: [
    { id: "pulseEnergies", label: "Pulse energies", kind: "numberList" },
    { id: "squaredRadii", label: "Squared ablation radii", kind: "numberList" },
  ],
  outputs: [
    {
      id: "thresholdEnergy",
      label: "Fitted threshold energy",
      kind: "number",
      minimum: 0,
    },
    {
      id: "beamRadius",
      label: "Fitted beam radius",
      kind: "number",
      minimum: 0,
    },
    { id: "slope", label: "Liu-plot slope", kind: "number" },
  ],
  title: "Ablation Threshold Fit",
});

export const run = tool.execute;
export default tool;
