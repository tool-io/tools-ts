import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for social engineering coverage gap.",
  expected: {
    id: "socialEngineeringScenarios",
    label: "Social-engineering scenarios",
  },
  example: {
    expected: [
      "fraudulent instruction",
      "vendor impersonation",
      "employee theft",
    ],
    observed: ["employee theft", "vendor impersonation"],
  },
  id: "insurance/social-engineering-coverage-gap",
  observed: { id: "crimePolicyScenarios", label: "Crime-policy scenarios" },
  title: "Social Engineering Coverage Gap",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
