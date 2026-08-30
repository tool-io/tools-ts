import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for mvr code match.",
  expected: { id: "recognizedCodes", label: "Recognized MVR codes" },
  example: {
    expected: ["SPEED", "DUI", "FAIL_YIELD"],
    observed: ["SPEED", "FAIL_YIELD", "LOCAL_17"],
  },
  id: "insurance/mvr-code-match",
  observed: { id: "reportedCodes", label: "Reported MVR codes" },
  title: "MVR Code Match",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
