import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for video provenance check.",
  expected: { id: "requiredSteps", label: "Required provenance steps" },
  example: {
    expected: [
      "original file",
      "uploader contact",
      "timestamp check",
      "location check",
    ],
    observed: ["original file", "timestamp check", "location check"],
  },
  id: "journalism/video-provenance-check",
  observed: { id: "completedSteps", label: "Completed provenance steps" },
  title: "Video Provenance Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
