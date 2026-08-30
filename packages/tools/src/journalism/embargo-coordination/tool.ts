import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Audit embargo coordination confirmations across required recipients.",
  expected: { id: "requiredRecipients", label: "Required embargo recipients" },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/embargo-coordination",
  observed: { id: "confirmedRecipients", label: "Confirmed recipients" },
  title: "Embargo Coordination",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
