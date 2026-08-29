import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleVonMises } from "../advanced-samplers.js";

export const example = {
  input: { meanDirection: 0, concentration: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [-0.23904571791263507, 0.20039924528108166, 3.0775941970129157],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/von-mises-sampler",
  title: "Von Mises Circular Distribution Sampler",
  description:
    "Draw angles in radians on [-π,π) with a circular mean and nonnegative concentration using rejection sampling.",
  inputs: [
    { id: "meanDirection", kind: "number", label: "mean Direction" },
    { id: "concentration", kind: "number", label: "concentration", minimum: 0 },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [{ id: "samples", kind: "numberList", label: "samples" }],
  calculate: (input) =>
    sampleVonMises(
      input.meanDirection as number,
      input.concentration as number,
      input.count as number,
      input.seed as string,
    ),
});
export type VonMisesSamplerInput = Readonly<typeof example.input>;
export type VonMisesSamplerOutput = Readonly<typeof example.output>;
export const vonMisesSamplerTool = tool;
export const runVonMisesSampler = tool.execute;
export default tool;
