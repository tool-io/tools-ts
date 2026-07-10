import { createSimpleTool, simpleError } from "../../core/simple.js";
export const unitRateTool = createSimpleTool({
  id: "proportions/unit-rate",
  title: "Unit Rate Calculator",
  description: "Calculate an amount per one unit.",
  inputs: [
    { id: "amount", label: "Amount", kind: "number" },
    { id: "units", label: "Units", kind: "number" },
  ],
  outputs: [{ id: "unitRate", label: "Unit rate", kind: "number" }],
  calculate: (input) => {
    const units = input.units as number;
    if (units === 0) simpleError("units", "Units must not be zero.");
    return { unitRate: (input.amount as number) / units };
  },
});
export const runUnitRate = unitRateTool.execute;
export default unitRateTool;
