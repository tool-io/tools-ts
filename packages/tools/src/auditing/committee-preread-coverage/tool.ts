import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit audit-committee preread coverage.",
  expected: { id: "requiredMaterials", label: "Required preread materials" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/committee-preread-coverage",
  observed: { id: "providedMaterials", label: "Provided materials" },
  title: "Committee Preread Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
