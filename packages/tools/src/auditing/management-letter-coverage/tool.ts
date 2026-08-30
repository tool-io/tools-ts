import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit management-letter comment coverage.",
  expected: {
    id: "requiredComments",
    label: "Required management-letter comments",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/management-letter-coverage",
  observed: { id: "documentedComments", label: "Documented comments" },
  title: "Management-Letter Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
