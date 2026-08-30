import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AlloyPercentageMassShareInput = Readonly<{
  readonly componentWeightGrams: number;
  readonly totalWeightGrams: number;
}>;
export type AlloyPercentageMassShareOutput = Readonly<{
  readonly componentPercent: number;
}>;

export const calculateAlloyPercentageMassShare = (
  x: AlloyPercentageMassShareInput,
): AlloyPercentageMassShareOutput => {
  if (!Number.isFinite(x.componentWeightGrams) || x.componentWeightGrams < 0)
    simpleError("componentWeightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.totalWeightGrams) || x.totalWeightGrams <= 0)
    simpleError("totalWeightGrams", "Provide a finite positive number.");
  if (x.componentWeightGrams > x.totalWeightGrams)
    simpleError(
      "componentWeightGrams",
      "Component mass cannot exceed total mass.",
    );
  const componentPercent = (x.componentWeightGrams / x.totalWeightGrams) * 100;
  if (!Number.isFinite(componentPercent))
    simpleError(
      "componentPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    componentPercent: Object.is(componentPercent, -0) ? 0 : componentPercent,
  };
};

export const example = {
  input: {
    componentWeightGrams: 18,
    totalWeightGrams: 20,
  },
  output: { componentPercent: 90 },
} satisfies ToolExample<
  AlloyPercentageMassShareInput,
  AlloyPercentageMassShareOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/alloy-percentage-mass-share",
  title: "Alloy Percentage Mass Share",
  description:
    "Find an alloy component's mass percentage from component and total masses.",
  inputs: [
    {
      id: "componentWeightGrams",
      kind: "number",
      label: "Component Weight Grams",
      unit: "g",
    },
    {
      id: "totalWeightGrams",
      kind: "number",
      label: "Total Weight Grams",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "componentPercent",
      kind: "number",
      label: "Component Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateAlloyPercentageMassShare({
      componentWeightGrams: input.componentWeightGrams as number,
      totalWeightGrams: input.totalWeightGrams as number,
    }),
});
export const runAlloyPercentageMassShare = tool.execute;
export default tool;
