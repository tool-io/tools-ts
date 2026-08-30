import { createRangeScreen } from "../../core/operational.js";

const operation = createRangeScreen({
  description:
    "Compare the measured value with caller-supplied bounds for release label window check.",
  example: { value: 20, minimum: 0, maximum: 30 },
  id: "numismatics/release-label-window-check",
  maximum: { id: "maximumDays", label: "Maximum eligible days", unit: "days" },
  minimum: { id: "minimumDays", label: "Minimum eligible days", unit: "days" },
  title: "Release Label Window Check",
  value: { id: "daysFromRelease", label: "Days from release", unit: "days" },
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
