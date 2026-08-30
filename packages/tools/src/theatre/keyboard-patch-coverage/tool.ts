import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit keyboard patch coverage.",
  expected: { id: "requiredPatches", label: "Required keyboard patches" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/keyboard-patch-coverage",
  observed: { id: "programmedPatches", label: "Programmed patches" },
  title: "Keyboard-Patch Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
