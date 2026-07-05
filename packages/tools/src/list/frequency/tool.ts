import { createSimpleTool } from "../../core/simple.js";
export const frequencyTool = createSimpleTool({
  id: "list/frequency",
  title: "List Frequency Counter",
  description: "Count occurrences of strings in a list.",
  inputs: [{ id: "values", label: "Values", kind: "stringList" }],
  outputs: [{ id: "frequencies", label: "Frequencies", kind: "object" }],
  calculate: (input) => {
    const frequencies: Record<string, number> = Object.create(null);
    for (const value of input.values as string[])
      frequencies[value] = (frequencies[value] ?? 0) + 1;
    return { frequencies: { ...frequencies } };
  },
});
export const runFrequency = frequencyTool.execute;
export default frequencyTool;
