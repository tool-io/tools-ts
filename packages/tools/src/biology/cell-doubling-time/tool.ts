import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellDoublingTimeExample = {
  input: { elapsedHours: 9, finalCount: 800, initialCount: 100 },
} satisfies ToolExample<{
  readonly elapsedHours: number;
  readonly finalCount: number;
  readonly initialCount: number;
}>;

export const cellDoublingTimeTool = createSimpleTool({
  id: "biology/cell-doubling-time",
  title: "Doubling Time (PDT)",
  description:
    "Calculate population doubling time as elapsed hours times ln(2), divided by ln(final count / initial count).",
  inputs: [
    { id: "initialCount", label: "Initial count", kind: "number" },
    { id: "finalCount", label: "Final count", kind: "number" },
    { id: "elapsedHours", label: "Elapsed time", kind: "number", unit: "h" },
  ],
  outputs: [
    {
      id: "doublingTimeHours",
      label: "Doubling time",
      kind: "number",
      unit: "h",
    },
  ],
  calculate: (input) => {
    const initialCount = input.initialCount as number;
    const finalCount = input.finalCount as number;
    const elapsedHours = input.elapsedHours as number;
    if (initialCount <= 0 || finalCount <= 0)
      simpleError(
        "initialCount",
        "Cell counts must be greater than zero.",
        "invalid_counts",
      );
    if (finalCount <= initialCount)
      simpleError(
        "finalCount",
        "Final count must exceed the initial count.",
        "invalid_growth",
      );
    if (elapsedHours <= 0)
      simpleError(
        "elapsedHours",
        "Elapsed hours must be greater than zero.",
        "invalid_value",
      );
    return {
      doublingTimeHours:
        (elapsedHours * Math.LN2) / Math.log(finalCount / initialCount),
    };
  },
});
export const runCellDoublingTime = cellDoublingTimeTool.execute;
export default cellDoublingTimeTool;
