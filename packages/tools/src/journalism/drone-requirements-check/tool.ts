import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for drone requirements check.",
  expected: { id: "requiredApprovals", label: "Required flight approvals" },
  example: {
    expected: [
      "pilot credential",
      "airspace authorization",
      "location permission",
    ],
    observed: ["pilot credential", "location permission"],
  },
  id: "journalism/drone-requirements-check",
  observed: { id: "obtainedApprovals", label: "Obtained approvals" },
  title: "Drone Requirements Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
