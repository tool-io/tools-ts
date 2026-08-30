import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit credit-memo authorization and refund evidence.",
  expected: { id: "requiredEvidence", label: "Required credit-memo evidence" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/credit-memo-vouching",
  observed: { id: "vouchedEvidence", label: "Vouched evidence" },
  title: "Credit-Memo Vouching",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
