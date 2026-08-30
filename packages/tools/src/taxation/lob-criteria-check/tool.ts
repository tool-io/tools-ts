import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied requirements and observations for lob criteria check.",
  expected: { id: "requiredCriteria", label: "Required LOB criteria" },
  example: {
    expected: ["ownership test", "base erosion test", "qualified resident"],
    observed: ["ownership test", "qualified resident"],
  },
  id: "taxation/lob-criteria-check",
  observed: { id: "satisfiedCriteria", label: "Satisfied criteria" },
  title: "LOB Criteria Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
