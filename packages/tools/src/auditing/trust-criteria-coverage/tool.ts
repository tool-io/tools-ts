import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit trust-services criteria coverage.",
  expected: { id: "requiredCriteria", label: "Required trust criteria" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/trust-criteria-coverage",
  observed: { id: "assessedCriteria", label: "Assessed criteria" },
  title: "Trust-Criteria Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
