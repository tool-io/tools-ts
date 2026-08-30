import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for relationship bonus tracker.",
  expected: { id: "bonusRequirements", label: "Bonus requirements" },
  example: {
    expected: ["direct deposit", "minimum balance", "new money"],
    observed: ["direct deposit", "new money"],
  },
  id: "banking/relationship-bonus-tracker",
  observed: { id: "completedRequirements", label: "Completed requirements" },
  title: "Relationship Bonus Tracker",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
