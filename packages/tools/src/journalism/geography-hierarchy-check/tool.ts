import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for geography hierarchy check.",
  expected: { id: "expectedHierarchy", label: "Expected geographic hierarchy" },
  example: {
    expected: ["country", "state", "county", "city"],
    observed: ["country", "state", "city"],
  },
  id: "journalism/geography-hierarchy-check",
  observed: { id: "observedHierarchy", label: "Observed hierarchy" },
  title: "Geography Hierarchy Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
