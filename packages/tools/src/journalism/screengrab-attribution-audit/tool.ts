import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit screengrab attribution coverage.",
  expected: {
    id: "requiredAttributions",
    label: "Required screengrab attributions",
  },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/screengrab-attribution-audit",
  observed: { id: "presentAttributions", label: "Present attributions" },
  title: "Screengrab Attribution Audit",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
