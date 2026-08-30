import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for understudy cover matrix.",
  expected: { id: "requiredTracks", label: "Required performance tracks" },
  example: {
    expected: ["lead", "dance captain", "ensemble A"],
    observed: ["lead", "ensemble A"],
  },
  id: "theatre/understudy-cover-matrix",
  observed: { id: "coveredTracks", label: "Covered tracks" },
  title: "Understudy Cover Matrix",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
