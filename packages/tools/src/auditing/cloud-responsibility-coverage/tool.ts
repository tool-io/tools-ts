import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit cloud shared-responsibility assignments.",
  expected: {
    id: "requiredResponsibilities",
    label: "Required cloud responsibilities",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/cloud-responsibility-coverage",
  observed: {
    id: "assignedResponsibilities",
    label: "Assigned responsibilities",
  },
  title: "Cloud Responsibility Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
