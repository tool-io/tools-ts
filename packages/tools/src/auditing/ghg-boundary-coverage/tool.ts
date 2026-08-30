import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit greenhouse-gas boundary coverage.",
  expected: {
    id: "requiredCategories",
    label: "Required GHG boundary categories",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/ghg-boundary-coverage",
  observed: { id: "includedCategories", label: "Included categories" },
  title: "GHG Boundary Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
