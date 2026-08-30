import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit required C2PA provenance assertions.",
  expected: { id: "requiredAssertions", label: "Required C2PA assertions" },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/c2pa-provenance-audit",
  observed: { id: "presentAssertions", label: "Present C2PA assertions" },
  title: "C2PA Provenance Audit",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
