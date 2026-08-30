import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit costume-plot character and scene coverage.",
  expected: {
    id: "requiredAppearances",
    label: "Required character-scene appearances",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/costume-plot-coverage",
  observed: { id: "plottedAppearances", label: "Plotted appearances" },
  title: "Costume-Plot Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
