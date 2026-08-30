import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for title policy scope comparison.",
  expected: { id: "ownerPolicyRisks", label: "Owner-policy covered risks" },
  example: {
    expected: ["ownership defect", "prior lien", "forgery"],
    observed: ["prior lien", "forgery"],
  },
  id: "insurance/title-policy-scope-comparison",
  observed: { id: "lenderPolicyRisks", label: "Lender-policy covered risks" },
  title: "Title Policy Scope Comparison",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
