import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const SILVER_RATIO = 1 + Math.SQRT2;

export const silverRatioTool = createSimpleTool({
  id: "arithmetic/silver-ratio",
  title: "Silver Ratio Calculator",
  description:
    "Split a total length into two parts whose ratio is the silver ratio δ = 1 + √2.",
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
      description: "Larger part, whose ratio to the smaller part equals δ.",
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
    const larger =
      ((input.total as number) * SILVER_RATIO) / (SILVER_RATIO + 1);
    return { larger, smaller: (input.total as number) - larger };
  },
});
export const runSilverRatio = silverRatioTool.execute;
export default silverRatioTool;

export type SilverRatioInput = {
  readonly total: number;
};

export type SilverRatioOutput = {
  readonly larger: number;
  readonly smaller: number;
};

export const silverRatioExample = {
  input: {
    total: 1,
  },
  output: {
    larger: 0.7071067811865476,
    smaller: 0.2928932188134524,
  },
} satisfies ToolExample<SilverRatioInput, SilverRatioOutput>;
