import { createSimpleTool, simpleError } from "../../core/simple.js";
export const frequencyTableTool = createSimpleTool({
  id: "statistics/frequency-table",
  title: "Frequency Table Generator",
  description:
    "Count numeric values and return a deterministic ascending frequency table.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "table", label: "Frequency table", kind: "object" }],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    const counts = new Map<number, number>();
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
    return {
      table: {
        entries: [...counts]
          .sort((a, b) => a[0] - b[0])
          .map(([value, count]) => ({ value, count })),
      },
    };
  },
});
export const runFrequencyTable = frequencyTableTool.execute;
export default frequencyTableTool;
