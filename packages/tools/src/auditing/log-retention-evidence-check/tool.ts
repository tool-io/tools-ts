import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for log retention evidence check.",
  expected: { id: "requiredEvidence", label: "Required retention evidence" },
  example: {
    expected: ["policy", "sample logs", "deletion proof"],
    observed: ["policy", "sample logs"],
  },
  id: "auditing/log-retention-evidence-check",
  observed: { id: "availableEvidence", label: "Available evidence" },
  title: "Log Retention Evidence Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
