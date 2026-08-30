import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied requirements and observations for onboarding access checklist.",
  expected: { id: "requiredAccess", label: "Required system access" },
  example: {
    expected: ["cms", "email", "analytics", "source vault"],
    observed: ["cms", "email", "analytics"],
  },
  id: "journalism/onboarding-access-checklist",
  observed: { id: "grantedAccess", label: "Granted system access" },
  title: "Onboarding Access Checklist",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
