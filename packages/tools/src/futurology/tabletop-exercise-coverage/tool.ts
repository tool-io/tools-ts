import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit futures tabletop exercise coverage.",
  expected: { id: "requiredInjects", label: "Required exercise injects" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "futurology/tabletop-exercise-coverage",
  observed: { id: "coveredInjects", label: "Covered injects" },
  title: "Tabletop Exercise Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
