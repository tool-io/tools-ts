import { createSimpleTool, simpleError } from "../../core/simple.js";
export const minMaxTool = createSimpleTool({
  id: "normalize/min-max",
  title: "Min-Max Normalization Tool",
  description: "Scale a numeric dataset to a requested inclusive range.",
  inputs: [
    { id: "values", label: "Values", kind: "numberList" },
    {
      id: "targetMinimum",
      label: "Target minimum",
      kind: "number",
      default: 0,
      required: false,
    },
    {
      id: "targetMaximum",
      label: "Target maximum",
      kind: "number",
      default: 1,
      required: false,
    },
  ],
  outputs: [
    { id: "values", label: "Normalized values", kind: "numberList" },
    { id: "sourceMinimum", label: "Source minimum", kind: "number" },
    { id: "sourceMaximum", label: "Source maximum", kind: "number" },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    const sourceMinimum = Math.min(...values),
      sourceMaximum = Math.max(...values),
      targetMinimum = input.targetMinimum as number,
      targetMaximum = input.targetMaximum as number;
    if (sourceMinimum === sourceMaximum)
      simpleError("values", "Source values need a nonzero range.");
    if (targetMinimum >= targetMaximum)
      simpleError(
        "targetMinimum",
        "Target minimum must be below target maximum.",
      );
    return {
      values: values.map(
        (value) =>
          targetMinimum +
          ((value - sourceMinimum) / (sourceMaximum - sourceMinimum)) *
            (targetMaximum - targetMinimum),
      ),
      sourceMinimum,
      sourceMaximum,
    };
  },
});
export const runMinMax = minMaxTool.execute;
export default minMaxTool;
