import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for builder's risk soft-cost check.",
  expected: { id: "requestedSoftCosts", label: "Requested soft costs" },
  example: {
    expected: ["design fees", "permits", "interest"],
    observed: ["design fees", "permits"],
  },
  id: "insurance/builders-risk-soft-costs-check",
  observed: { id: "includedSoftCosts", label: "Included soft costs" },
  title: "Builder's Risk Soft-Cost Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
