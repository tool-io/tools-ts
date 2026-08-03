import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  calculateInclusiveQuartiles,
  type Quartiles,
} from "../inclusive-quartiles/tool.js";

export const calculateQuartiles = (
  values: readonly number[],
): Quartiles | null => calculateInclusiveQuartiles(values);

export const quartilesExample = {
  input: { values: [1, 2, 3, 4, 5] },
  output: { quartiles: [2, 3, 4] },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly quartiles: readonly number[] }
>;

export const quartilesTool = createSimpleTool({
  id: "statistics/quartiles",
  title: "Quartiles Calculator",
  description:
    "Calculate Q1, the median (Q2), and Q3 with the inclusive median-of-halves method.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "quartiles",
      id: "quartiles",
      kind: "numberList",
      label: "Quartiles",
    },
  ],
  calculate: (input) => {
    const quartiles = calculateQuartiles(input.values as number[]);
    if (quartiles === null)
      simpleError("values", "Enter at least one finite number.");
    return { quartiles };
  },
});

export const runQuartiles = quartilesTool.execute;
export default quartilesTool;
