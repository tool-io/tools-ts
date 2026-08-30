import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit drafting-sheet title-block and legend coverage.",
  expected: {
    id: "requiredElements",
    label: "Required drafting-sheet elements",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/drafting-sheet-coverage",
  observed: { id: "presentElements", label: "Present elements" },
  title: "Drafting-Sheet Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
