import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for grading detail code match.",
  expected: { id: "recognizedCodes", label: "Recognized detail codes" },
  example: {
    expected: ["cleaned", "engraved", "whizzed"],
    observed: ["cleaned", "whizzed", "scratch"],
  },
  id: "numismatics/grading-detail-code-match",
  observed: { id: "observedCodes", label: "Observed label codes" },
  title: "Grading Detail Code Match",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
