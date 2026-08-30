import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly spotDiameterMicrometers: number;
  readonly pulseCount: number;
  readonly newAreaFractionPerPulse: number;
}>;
export type Output = Readonly<{
  readonly singleSpotAreaSquareMicrometers: number;
  readonly grossSampledAreaSquareMicrometers: number;
  readonly effectiveNewAreaSquareMicrometers: number;
}>;

export const calculate = (input: Input): Output => {
  const singleSpotAreaSquareMicrometers =
    Math.PI * (input.spotDiameterMicrometers / 2) ** 2;
  const grossSampledAreaSquareMicrometers =
    singleSpotAreaSquareMicrometers * input.pulseCount;
  return {
    singleSpotAreaSquareMicrometers,
    grossSampledAreaSquareMicrometers,
    effectiveNewAreaSquareMicrometers:
      grossSampledAreaSquareMicrometers * input.newAreaFractionPerPulse,
  };
};

export const exampleInput = {
  spotDiameterMicrometers: 2,
  pulseCount: 10,
  newAreaFractionPerPulse: 0.5,
} satisfies Input;
export const exampleOutput = {
  singleSpotAreaSquareMicrometers: 3.141592653589793,
  grossSampledAreaSquareMicrometers: 31.41592653589793,
  effectiveNewAreaSquareMicrometers: 15.707963267948966,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      spotDiameterMicrometers: input.spotDiameterMicrometers as number,
      pulseCount: input.pulseCount as number,
      newAreaFractionPerPulse: input.newAreaFractionPerPulse as number,
    }),
  description:
    "Estimate gross and nonoverlapping area sampled by a sequence of ablation pulses.",
  id: "laser/ablation-sampling-area",
  inputs: [
    {
      id: "spotDiameterMicrometers",
      label: "Ablation spot diameter",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    { id: "pulseCount", label: "Pulse count", kind: "integer", minimum: 0 },
    {
      id: "newAreaFractionPerPulse",
      label: "New-area fraction per pulse",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "singleSpotAreaSquareMicrometers",
      label: "Single-spot area",
      kind: "number",
      minimum: 0,
      unit: "µm²",
    },
    {
      id: "grossSampledAreaSquareMicrometers",
      label: "Gross sampled area",
      kind: "number",
      minimum: 0,
      unit: "µm²",
    },
    {
      id: "effectiveNewAreaSquareMicrometers",
      label: "Effective new area",
      kind: "number",
      minimum: 0,
      unit: "µm²",
    },
  ],
  title: "Ablation Sampling Area",
});

export const run = tool.execute;
export default tool;
