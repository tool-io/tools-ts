import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Audit hostile-environment and first-aid training module completion.",
  expected: { id: "requiredModules", label: "Required HEFAT modules" },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/hefat-coverage",
  observed: { id: "completedModules", label: "Completed HEFAT modules" },
  title: "HEFAT Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
