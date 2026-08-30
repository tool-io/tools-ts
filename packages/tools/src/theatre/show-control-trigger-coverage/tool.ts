import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit show-control trigger mappings.",
  expected: { id: "requiredTriggers", label: "Required show-control triggers" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/show-control-trigger-coverage",
  observed: { id: "mappedTriggers", label: "Mapped triggers" },
  title: "Show-Control Trigger Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
