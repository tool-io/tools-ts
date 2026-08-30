import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit email authentication method coverage.",
  expected: {
    id: "requiredMethods",
    label: "Required email authentication methods",
  },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/email-auth-coverage",
  observed: { id: "configuredMethods", label: "Configured methods" },
  title: "Email Auth Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
