import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleHamiltonianNormal } from "../advanced-samplers.js";

export const example = {
  input: {
    start: 0,
    stepSize: 0.1,
    leapfrogSteps: 5,
    count: 3,
    seed: "tool.io",
  },
  output: {
    samples: [-0.37426344973998055, -1.0392168437448257, -0.9749560041324533],
    acceptanceRate: 1,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/hamiltonian-monte-carlo-sampler",
  title: "Hamiltonian Monte Carlo Standard Normal Sampler",
  description:
    "Run one-dimensional HMC with leapfrog integration and Metropolis correction for the standard normal target; report acceptance rate.",
  inputs: [
    { id: "start", kind: "number", label: "start" },
    { id: "stepSize", kind: "number", label: "step Size", minimum: 5e-324 },
    {
      id: "leapfrogSteps",
      kind: "integer",
      label: "leapfrog Steps",
      minimum: 1,
      maximum: 1000,
    },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [
    { id: "samples", kind: "numberList", label: "samples" },
    { id: "acceptanceRate", kind: "number", label: "acceptance Rate" },
  ],
  calculate: (input) =>
    sampleHamiltonianNormal(
      input.start as number,
      input.stepSize as number,
      input.leapfrogSteps as number,
      input.count as number,
      input.seed as string,
    ),
});
export type HamiltonianMonteCarloSamplerInput = Readonly<typeof example.input>;
export type HamiltonianMonteCarloSamplerOutput = Readonly<
  typeof example.output
>;
export const hamiltonianMonteCarloSamplerTool = tool;
export const runHamiltonianMonteCarloSampler = tool.execute;
export default tool;
