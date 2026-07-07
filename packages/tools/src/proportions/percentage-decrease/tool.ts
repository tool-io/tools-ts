import { createSimpleTool, simpleError } from "../../core/simple.js";
export const percentageDecreaseTool = createSimpleTool({
  id: "proportions/percentage-decrease",
  title: "Percentage Decrease Calculator",
  description:
    "Calculate the percentage decrease from an original value to a smaller value.",
  inputs: [
    { id: "originalValue", label: "Original value", kind: "number" },
    { id: "newValue", label: "New value", kind: "number" },
  ],
  outputs: [
    {
      id: "percentDecrease",
      label: "Percentage decrease",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const original = input.originalValue as number;
    if (original === 0)
      simpleError("originalValue", "Original value must not be zero.");
    const decrease =
      ((original - (input.newValue as number)) / Math.abs(original)) * 100;
    if (decrease < 0)
      simpleError("newValue", "New value must not exceed original value.");
    return { percentDecrease: decrease };
  },
});
export const runPercentageDecrease = percentageDecreaseTool.execute;
export default percentageDecreaseTool;
