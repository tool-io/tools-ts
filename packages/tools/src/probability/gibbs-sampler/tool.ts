import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleGibbsBivariateNormal } from "../advanced-samplers.js";

export const example = {
  input: { correlation: 0.5, startX: 0, startY: 0, count: 3, seed: "tool.io" },
  output: {
    samples: [
      [-0.6749592771397639, 0.6429879417072422],
      [-0.2992777865637015, -0.2633658648308185],
      [0.07609455933521236, 0.2629496913187021],
    ],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/gibbs-sampler",
  title: "Bivariate Normal Gibbs Sampler",
  description:
    "Alternate conditional Gaussian draws for a zero-mean, unit-variance bivariate normal with caller-supplied correlation. Samples are autocorrelated.",
  inputs: [
    { id: "correlation", kind: "number", label: "correlation" },
    { id: "startX", kind: "number", label: "start X" },
    { id: "startY", kind: "number", label: "start Y" },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [{ id: "samples", kind: "matrix", label: "samples" }],
  calculate: (input) =>
    sampleGibbsBivariateNormal(
      input.correlation as number,
      input.startX as number,
      input.startY as number,
      input.count as number,
      input.seed as string,
    ),
});
export type GibbsSamplerInput = Readonly<typeof example.input>;
export type GibbsSamplerOutput = Readonly<typeof example.output>;
export const gibbsSamplerTool = tool;
export const runGibbsSampler = tool.execute;
export default tool;
