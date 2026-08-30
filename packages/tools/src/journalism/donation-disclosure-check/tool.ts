import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for donation disclosure check.",
  expected: { id: "requiredDisclosures", label: "Required disclosures" },
  example: {
    expected: ["editor notice", "conflict statement", "recusal record"],
    observed: ["editor notice", "conflict statement"],
  },
  id: "journalism/donation-disclosure-check",
  observed: { id: "completedDisclosures", label: "Completed disclosures" },
  title: "Donation Disclosure Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
