import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit nightly show-report section coverage.",
  expected: { id: "requiredSections", label: "Required show-report sections" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/show-report-coverage",
  observed: { id: "presentSections", label: "Present sections" },
  title: "Show-Report Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
