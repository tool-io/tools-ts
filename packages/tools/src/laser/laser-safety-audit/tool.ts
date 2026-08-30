import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare required laser-safety controls with documented controls.",
  expected: { id: "requiredControls", label: "Required controls" },
  example: {
    expected: ["interlock test", "eyewear inspection", "training record"],
    observed: ["training record", "interlock test"],
  },
  observed: { id: "documentedControls", label: "Documented controls" },
  id: "laser/laser-safety-audit",
  title: "Laser Safety Audit",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
