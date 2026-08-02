import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const relativeStandardErrorExample = {
  input: { estimate: 50, standardError: 2 },
} satisfies ToolExample<{
  readonly estimate: number;
  readonly standardError: number;
}>;

export const relativeStandardErrorTool = createSimpleTool({
  id: "statistics/relative-standard-error",
  title: "Relative Standard Error Calculator",
  description:
    "Calculate standard error as a percentage of an estimate's magnitude.",
  inputs: [
    {
      id: "standardError",
      label: "Standard error",
      kind: "number",
      minimum: 0,
    },
    { id: "estimate", label: "Estimate", kind: "number" },
  ],
  outputs: [
    {
      id: "percent",
      label: "Relative standard error",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const estimate = input.estimate as number;
    if (estimate === 0) simpleError("estimate", "Estimate must not be zero.");
    return {
      percent: ((input.standardError as number) / Math.abs(estimate)) * 100,
    };
  },
});
export const runRelativeStandardError = relativeStandardErrorTool.execute;
export default relativeStandardErrorTool;
