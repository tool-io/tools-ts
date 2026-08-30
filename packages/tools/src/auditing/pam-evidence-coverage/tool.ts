import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit privileged-access-management evidence.",
  expected: { id: "requiredEvidence", label: "Required PAM evidence" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/pam-evidence-coverage",
  observed: { id: "availableEvidence", label: "Available evidence" },
  title: "PAM Evidence Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
