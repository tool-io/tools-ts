import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for cob assayer record match.",
  expected: { id: "catalogMarks", label: "Catalog assayer marks" },
  example: { expected: ["M", "oM", "MF"], observed: ["M", "MF", "R"] },
  id: "numismatics/cob-assayer-record-match",
  observed: { id: "observedMarks", label: "Observed marks" },
  title: "Cob Assayer Record Match",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
