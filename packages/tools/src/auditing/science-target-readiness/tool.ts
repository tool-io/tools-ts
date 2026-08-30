import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit science-based-target assurance readiness.",
  expected: {
    id: "requiredEvidence",
    label: "Required target-validation evidence",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/science-target-readiness",
  observed: { id: "availableEvidence", label: "Available evidence" },
  title: "Science-Target Readiness",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
