import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleDirichlet } from "../advanced-samplers.js";

export const example = {
  input: { alpha: [1, 1, 1], count: 3, seed: "tool.io" },
  output: {
    samples: [
      [0.2584175030282361, 0.05051730779002937, 0.6910651891817347],
      [0.10983381635425497, 0.4717744774712872, 0.41839170617445787],
      [0.3131745698454035, 0.4617401992438874, 0.2250852309107092],
    ],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/dirichlet-sampler",
  title: "Dirichlet Distribution Sampler",
  description:
    "Draw simplex-valued vectors by normalizing independent gamma variates with positive concentration parameters.",
  inputs: [
    { id: "alpha", kind: "numberList", label: "alpha" },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [{ id: "samples", kind: "matrix", label: "samples" }],
  calculate: (input) =>
    sampleDirichlet(
      input.alpha as number[],
      input.count as number,
      input.seed as string,
    ),
});
export type DirichletSamplerInput = Readonly<typeof example.input>;
export type DirichletSamplerOutput = Readonly<typeof example.output>;
export const dirichletSamplerTool = tool;
export const runDirichletSampler = tool.execute;
export default tool;
