import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare required laser labels with labels documented at the installation.",
  expected: { id: "requiredLabels", label: "Required labels" },
  example: {
    expected: ["aperture warning", "class label", "explanatory label"],
    observed: ["class label", "aperture warning"],
  },
  id: "laser/laser-label-coverage",
  observed: { id: "documentedLabels", label: "Documented labels" },
  title: "Laser Label Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
