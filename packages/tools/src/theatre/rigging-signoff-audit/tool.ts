import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit required rigging sign-offs.",
  expected: { id: "requiredSignoffs", label: "Required rigging sign-offs" },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/rigging-signoff-audit",
  observed: { id: "completedSignoffs", label: "Completed sign-offs" },
  title: "Rigging Sign-Off Audit",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
