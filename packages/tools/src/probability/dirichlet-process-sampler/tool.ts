import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleDirichletProcess } from "../advanced-samplers.js";

export const example = {
  input: { concentration: 1, components: 4, count: 3, seed: "tool.io" },
  output: {
    weights: [
      [
        0.8457345371134579, 0.048753207392317574, 0.07858647075235127,
        0.026925784741873238,
      ],
      [
        0.870103245601058, 0.04947158304205895, 0.030619029787892833,
        0.04980614156899021,
      ],
      [
        0.009900369914248586, 0.4361356295222692, 0.2498053358321852,
        0.304158664731297,
      ],
    ],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/dirichlet-process-sampler",
  title: "Truncated Dirichlet Process Stick-Breaking Sampler",
  description:
    "Draw truncated GEM stick-breaking weights from Beta(1, concentration); the final component collects all remaining mass.",
  inputs: [
    {
      id: "concentration",
      kind: "number",
      label: "concentration",
      minimum: 5e-324,
    },
    {
      id: "components",
      kind: "integer",
      label: "components",
      minimum: 2,
      maximum: 100,
    },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [{ id: "weights", kind: "matrix", label: "weights" }],
  calculate: (input) =>
    sampleDirichletProcess(
      input.concentration as number,
      input.components as number,
      input.count as number,
      input.seed as string,
    ),
});
export type DirichletProcessSamplerInput = Readonly<typeof example.input>;
export type DirichletProcessSamplerOutput = Readonly<typeof example.output>;
export const dirichletProcessSamplerTool = tool;
export const runDirichletProcessSampler = tool.execute;
export default tool;
