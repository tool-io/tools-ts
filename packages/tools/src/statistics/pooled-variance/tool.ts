import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const pooledVarianceExample = {
  input: {
    firstSize: 5,
    firstVariance: 4,
    secondSize: 5,
    secondVariance: 9,
  },
} satisfies ToolExample<{
  readonly firstSize: number;
  readonly firstVariance: number;
  readonly secondSize: number;
  readonly secondVariance: number;
}>;

export const pooledVarianceTool = createSimpleTool({
  id: "statistics/pooled-variance",
  title: "Pooled Variance Calculator",
  description:
    "Calculate pooled sample variance from two sample variances and sizes.",
  inputs: [
    {
      id: "firstVariance",
      label: "First sample variance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "firstSize",
      label: "First sample size",
      kind: "integer",
      minimum: 2,
    },
    {
      id: "secondVariance",
      label: "Second sample variance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "secondSize",
      label: "Second sample size",
      kind: "integer",
      minimum: 2,
    },
  ],
  outputs: [{ id: "pooledVariance", label: "Pooled variance", kind: "number" }],
  calculate: (input) => {
    const n1 = input.firstSize as number,
      n2 = input.secondSize as number;
    return {
      pooledVariance:
        ((n1 - 1) * (input.firstVariance as number) +
          (n2 - 1) * (input.secondVariance as number)) /
        (n1 + n2 - 2),
    };
  },
});
export const runPooledVariance = pooledVarianceTool.execute;
export default pooledVarianceTool;
