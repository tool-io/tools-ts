import { createSimpleTool, simpleError } from "../../core/simple.js";
export const breakEvenUnitsTool = createSimpleTool({
  id: "finance/break-even-units",
  title: "Break-Even Units Calculator",
  description: "Calculate unit sales required to cover fixed costs.",
  inputs: [
    { id: "fixedCosts", label: "Fixed costs", kind: "number", minimum: 0 },
    { id: "pricePerUnit", label: "Price per unit", kind: "number" },
    {
      id: "variableCostPerUnit",
      label: "Variable cost per unit",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "breakEvenUnits",
      label: "Break-even units",
      kind: "number",
      format: "count",
    },
    {
      id: "contributionPerUnit",
      label: "Contribution per unit",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const contributionPerUnit =
      (input.pricePerUnit as number) - (input.variableCostPerUnit as number);
    if (contributionPerUnit <= 0)
      simpleError(
        "pricePerUnit",
        "Price per unit must exceed variable cost per unit.",
      );
    return {
      breakEvenUnits: (input.fixedCosts as number) / contributionPerUnit,
      contributionPerUnit,
    };
  },
});
export const runBreakEvenUnits = breakEvenUnitsTool.execute;
export default breakEvenUnitsTool;
