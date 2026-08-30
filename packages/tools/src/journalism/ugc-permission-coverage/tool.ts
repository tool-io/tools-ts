import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit user-generated-content permission records.",
  expected: { id: "requiredPermissions", label: "Required UGC permissions" },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/ugc-permission-coverage",
  observed: { id: "documentedPermissions", label: "Documented permissions" },
  title: "UGC Permission Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
