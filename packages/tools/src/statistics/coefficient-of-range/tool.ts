import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const coefficientOfRangeExample = {
  input: { maximum: 8, minimum: 2 },
} satisfies ToolExample<{
  readonly maximum: number;
  readonly minimum: number;
}>;

export const coefficientOfRangeTool = createSimpleTool({
  id: "statistics/coefficient-of-range",
  title: "Coefficient of Range Calculator",
  description:
    "Calculate the range divided by the sum of maximum and minimum values.",
  inputs: [
    { id: "minimum", label: "Minimum", kind: "number" },
    { id: "maximum", label: "Maximum", kind: "number" },
  ],
  outputs: [
    { id: "coefficient", label: "Coefficient of range", kind: "number" },
  ],
  calculate: (input) => {
    const minimum = input.minimum as number,
      maximum = input.maximum as number;
    if (minimum > maximum)
      simpleError("minimum", "Minimum must not exceed maximum.");
    if (maximum + minimum === 0)
      simpleError("minimum", "Maximum plus minimum must not be zero.");
    return { coefficient: (maximum - minimum) / (maximum + minimum) };
  },
});
export const runCoefficientOfRange = coefficientOfRangeTool.execute;
export default coefficientOfRangeTool;
