import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit open-flame permit and safety readiness.",
  expected: { id: "requiredControls", label: "Required open-flame controls" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/open-flame-readiness",
  observed: { id: "confirmedControls", label: "Confirmed controls" },
  title: "Open-Flame Readiness",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
