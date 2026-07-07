import { createSimpleTool, simpleError } from "../../core/simple.js";
export const percentageChangeTool = createSimpleTool({
  id: "proportions/percentage-change",
  title: "Percentage Change Calculator",
  description:
    "Calculate signed percentage change from an old value to a new value.",
  inputs: [
    { id: "oldValue", label: "Old value", kind: "number" },
    { id: "newValue", label: "New value", kind: "number" },
  ],
  outputs: [
    {
      id: "percentChange",
      label: "Percentage change",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const old = input.oldValue as number;
    if (old === 0) simpleError("oldValue", "Old value must not be zero.");
    return {
      percentChange: (((input.newValue as number) - old) / Math.abs(old)) * 100,
    };
  },
});
export const runPercentageChange = percentageChangeTool.execute;
export default percentageChangeTool;
