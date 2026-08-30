import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Input = Readonly<{
  readonly revenueGrowthPercent: number;
  readonly profitMarginPercent: number;
  readonly minimumCombinedPercent: number;
}>;
export type Output = Readonly<{
  readonly combinedPercent: number;
  readonly marginToTargetPoints: number;
  readonly passes: boolean;
}>;
export const calculate = (input: Input): Output => {
  const combinedPercent =
    input.revenueGrowthPercent + input.profitMarginPercent;
  return {
    combinedPercent,
    marginToTargetPoints: combinedPercent - input.minimumCombinedPercent,
    passes: combinedPercent >= input.minimumCombinedPercent,
  };
};
export const exampleInput = {
  revenueGrowthPercent: 25,
  profitMarginPercent: 20,
  minimumCombinedPercent: 40,
} satisfies Input;
export const exampleOutput = {
  combinedPercent: 45,
  marginToTargetPoints: 5,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/growth-margin-rule",
  title: "Growth Margin Rule",
  description:
    "Screen combined growth and profit margin against a caller-selected rule-of-40 target.",
  inputs: [
    {
      id: "revenueGrowthPercent",
      label: "Revenue growth percent",
      kind: "number",
    },
    {
      id: "profitMarginPercent",
      label: "Profit margin percent",
      kind: "number",
    },
    {
      id: "minimumCombinedPercent",
      label: "Minimum combined percent",
      kind: "number",
    },
  ],
  outputs: [
    { id: "combinedPercent", label: "Combined percent", kind: "number" },
    {
      id: "marginToTargetPoints",
      label: "Margin to target points",
      kind: "number",
    },
    { id: "passes", label: "Passes", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      revenueGrowthPercent: value.revenueGrowthPercent as number,
      profitMarginPercent: value.profitMarginPercent as number,
      minimumCombinedPercent: value.minimumCombinedPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
