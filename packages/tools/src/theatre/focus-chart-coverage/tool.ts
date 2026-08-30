import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit focus-chart instrument coverage.",
  expected: {
    id: "requiredInstruments",
    label: "Required focus-chart instruments",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/focus-chart-coverage",
  observed: { id: "documentedInstruments", label: "Documented instruments" },
  title: "Focus-Chart Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
