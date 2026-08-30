import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit peer-review independence safeguards.",
  expected: {
    id: "requiredSafeguards",
    label: "Required independence safeguards",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/peer-review-independence",
  observed: { id: "documentedSafeguards", label: "Documented safeguards" },
  title: "Peer-Review Independence",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
