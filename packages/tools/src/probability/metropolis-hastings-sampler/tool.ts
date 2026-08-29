import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleMetropolisHastings } from "../advanced-samplers.js";

export const example = {
  input: { start: 0, proposalScale: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [-0.7793758406973559, -0.7793758406973559, -0.9106964359731907],
    acceptanceRate: 0.6666666666666666,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/metropolis-hastings-sampler",
  title: "Metropolis-Hastings Normal Sampler",
  description:
    "Use a Gaussian random-walk Metropolis-Hastings chain targeting the standard normal density. Report acceptance rate; samples are correlated.",
  inputs: [
    { id: "start", kind: "number", label: "start" },
    {
      id: "proposalScale",
      kind: "number",
      label: "proposal Scale",
      minimum: 5e-324,
    },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [
    { id: "samples", kind: "numberList", label: "samples" },
    { id: "acceptanceRate", kind: "number", label: "acceptance Rate" },
  ],
  calculate: (input) =>
    sampleMetropolisHastings(
      input.start as number,
      input.proposalScale as number,
      input.count as number,
      input.seed as string,
    ),
});
export type MetropolisHastingsSamplerInput = Readonly<typeof example.input>;
export type MetropolisHastingsSamplerOutput = Readonly<typeof example.output>;
export const metropolisHastingsSamplerTool = tool;
export const runMetropolisHastingsSampler = tool.execute;
export default tool;
