import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit hidden-asset search source coverage.",
  expected: { id: "requiredSources", label: "Required asset-search sources" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/hidden-asset-search-coverage",
  observed: { id: "searchedSources", label: "Searched sources" },
  title: "Hidden-Asset Search Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
