import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for ratio narrative check.",
  expected: { id: "requiredElements", label: "Required narrative elements" },
  example: {
    expected: ["ratio", "comparison", "cause", "implication"],
    observed: ["ratio", "comparison", "cause"],
  },
  id: "auditing/ratio-narrative-check",
  observed: { id: "presentElements", label: "Present narrative elements" },
  title: "Ratio Narrative Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
