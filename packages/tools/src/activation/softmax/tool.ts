import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { values: [1, 2, 3] },
  output: {
    probabilities: [
      0.09003057317038046, 0.24472847105479764, 0.6652409557748218,
    ],
  },
} satisfies ToolExample<{ values: number[] }, { probabilities: number[] }>;

export const softmaxTool = createSimpleTool({
  id: "activation/softmax",
  title: "Softmax",
  description:
    "Convert a list of scores into a probability distribution with the numerically stable softmax.",
  inputs: [
    {
      description: "Raw scores.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
  ],
  outputs: [
    {
      description: "Probabilities whose mathematical sum is one.",
      id: "probabilities",
      kind: "numberList",
      label: "Probabilities",
    },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0)
      return simpleError("values", "Values must not be empty.", "values_empty");
    const max = Math.max(...values);
    const exponentials = values.map((value) => Math.exp(value - max));
    const sum = exponentials.reduce((total, value) => total + value, 0);
    return {
      probabilities: exponentials.map((value) => value / sum),
    };
  },
});

export const runSoftmax = softmaxTool.execute;
export default softmaxTool;
