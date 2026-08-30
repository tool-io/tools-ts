import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit audit-universe entity and process coverage.",
  expected: {
    id: "requiredEntities",
    label: "Required audit-universe entities",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/audit-universe-coverage",
  observed: { id: "coveredEntities", label: "Covered entities" },
  title: "Audit-Universe Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
