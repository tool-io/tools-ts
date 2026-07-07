import { createSimpleTool, simpleError } from "../../core/simple.js";
export const percentageIncreaseTool = createSimpleTool({
  id: "proportions/percentage-increase",
  title: "Percentage Increase Calculator",
  description:
    "Calculate the percentage increase from an original value to a larger value.",
  inputs: [
    { id: "originalValue", label: "Original value", kind: "number" },
    { id: "newValue", label: "New value", kind: "number" },
  ],
  outputs: [
    {
      id: "percentIncrease",
      label: "Percentage increase",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const original = input.originalValue as number;
    if (original === 0)
      simpleError("originalValue", "Original value must not be zero.");
    const increase =
      (((input.newValue as number) - original) / Math.abs(original)) * 100;
    if (increase < 0)
      simpleError("newValue", "New value must not be below original value.");
    return { percentIncrease: increase };
  },
});
export const runPercentageIncrease = percentageIncreaseTool.execute;
export default percentageIncreaseTool;
