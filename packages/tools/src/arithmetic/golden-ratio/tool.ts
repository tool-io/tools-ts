import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export const goldenRatioTool = createSimpleTool({
  id: "arithmetic/golden-ratio",
  title: "Golden Ratio Calculator",
  description:
    "Split a total length into two parts whose ratio is the golden ratio φ.",
  inputs: [
    {
      description: "Total length to divide.",
      id: "total",
      label: "Total",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Larger part, equal to total divided by φ.",
      id: "larger",
      label: "Larger part",
      kind: "number",
    },
    {
      description: "Smaller part, equal to total minus the larger part.",
      id: "smaller",
      label: "Smaller part",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const larger = (input.total as number) / GOLDEN_RATIO;
    return { larger, smaller: (input.total as number) - larger };
  },
});
export const runGoldenRatio = goldenRatioTool.execute;
export default goldenRatioTool;

export type GoldenRatioInput = {
  readonly total: number;
};

export type GoldenRatioOutput = {
  readonly larger: number;
  readonly smaller: number;
};

export const goldenRatioExample = {
  input: {
    total: 1,
  },
  output: {
    larger: 0.6180339887498948,
    smaller: 0.3819660112501052,
  },
} satisfies ToolExample<GoldenRatioInput, GoldenRatioOutput>;
