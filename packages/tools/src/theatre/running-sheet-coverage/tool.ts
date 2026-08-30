import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit running-sheet action coverage.",
  expected: { id: "requiredActions", label: "Required running-sheet actions" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/running-sheet-coverage",
  observed: { id: "documentedActions", label: "Documented actions" },
  title: "Running-Sheet Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
