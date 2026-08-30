import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit collective-bargaining agreement clause coverage.",
  expected: { id: "requiredClauses", label: "Required CBA clauses" },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/cba-clause-coverage",
  observed: { id: "presentClauses", label: "Present CBA clauses" },
  title: "CBA Clause Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
