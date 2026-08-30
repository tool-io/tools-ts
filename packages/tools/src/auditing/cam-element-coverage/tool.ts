import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit critical-audit-matter element coverage.",
  expected: { id: "requiredElements", label: "Required CAM elements" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/cam-element-coverage",
  observed: { id: "presentElements", label: "Present CAM elements" },
  title: "CAM Element Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
