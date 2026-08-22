import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const ratioToPercentageTool = createSimpleTool({
  id: "arithmetic/ratio-to-percentage",
  title: "Ratio to Percentage Converter",
  description: "Convert a ratio to a percentage by multiplying by one hundred.",
  inputs: [{ id: "ratio", label: "Ratio", kind: "number" }],
  outputs: [{ id: "percent", label: "Percent", kind: "number", unit: "%" }],
  calculate: (input) => {
    return { percent: (input.ratio as number) * 100 };
  },
});
export const runRatioToPercentage = ratioToPercentageTool.execute;
export default ratioToPercentageTool;

export type RatioToPercentageInput = {
  readonly ratio: number;
};

export type RatioToPercentageOutput = {
  readonly percent: number;
};

export const ratioToPercentageExample = {
  input: {
    ratio: 1,
  },
  output: {
    percent: 100,
  },
} satisfies ToolExample<RatioToPercentageInput, RatioToPercentageOutput>;
