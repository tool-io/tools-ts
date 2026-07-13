import { createSimpleTool, simpleError } from "../../core/simple.js";

export const modeTool = createSimpleTool({
  id: "statistics/mode",
  title: "Mode Calculator",
  description:
    "Return every most-frequent value in a finite numeric list, sorted ascending.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    { id: "modes", label: "Modes", kind: "numberList" },
    { id: "frequency", label: "Frequency", kind: "integer" },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");

    const frequencies = new Map<number, number>();
    for (const value of values)
      frequencies.set(value, (frequencies.get(value) ?? 0) + 1);
    const frequency = Math.max(...frequencies.values());
    const modes = [...frequencies]
      .filter(([, count]) => count === frequency)
      .map(([value]) => value)
      .sort((left, right) => left - right);
    return { frequency, modes };
  },
});

export const runMode = modeTool.execute;
export default modeTool;
