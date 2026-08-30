import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit SEFA field and note coverage.",
  expected: { id: "requiredFields", label: "Required SEFA fields" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/sefa-coverage",
  observed: { id: "presentFields", label: "Present fields" },
  title: "SEFA Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
