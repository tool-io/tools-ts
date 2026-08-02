import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const pooledStandardDeviationExample = {
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

export const pooledStandardDeviationTool = createSimpleTool({
  id: "statistics/pooled-standard-deviation",
  title: "Pooled Standard Deviation Calculator",
  description:
    "Calculate pooled sample standard deviation from two sample variances and sizes.",
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
  outputs: [
    {
      id: "pooledStandardDeviation",
      label: "Pooled standard deviation",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const n1 = input.firstSize as number,
      n2 = input.secondSize as number,
      variance =
        ((n1 - 1) * (input.firstVariance as number) +
          (n2 - 1) * (input.secondVariance as number)) /
        (n1 + n2 - 2);
    return { pooledStandardDeviation: Math.sqrt(variance) };
  },
});
export const runPooledStandardDeviation = pooledStandardDeviationTool.execute;
export default pooledStandardDeviationTool;
