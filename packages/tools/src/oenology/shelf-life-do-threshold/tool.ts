import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ShelfLifeDoThresholdInput = {
  readonly currentDoMgPerL: number;
  readonly oxygenBudgetMgPerL?: number;
  readonly uptakeMgPerLPerMonth?: number;
};

export type ShelfLifeDoThresholdOutput = {
  readonly monthsRemaining: number;
};

export const shelfLifeDoThresholdExample = {
  input: {
    currentDoMgPerL: 1.2,
    oxygenBudgetMgPerL: 3,
    uptakeMgPerLPerMonth: 0.2,
  },
  output: {
    monthsRemaining: 9,
  },
} satisfies ToolExample<ShelfLifeDoThresholdInput, ShelfLifeDoThresholdOutput>;

export const calculateShelfLifeDoThreshold = (
  input: ShelfLifeDoThresholdInput,
): ShelfLifeDoThresholdOutput => {
  const uptake = input.uptakeMgPerLPerMonth ?? 0.2;
  if (uptake <= 0)
    simpleError(
      "uptakeMgPerLPerMonth",
      "The monthly oxygen pickup must be positive.",
      "invalid_value",
    );
  const budget = input.oxygenBudgetMgPerL ?? 3;
  const remaining = (budget - input.currentDoMgPerL) / uptake;
  return {
    monthsRemaining: roundStatistic(Math.max(0, remaining)),
  };
};

export const shelfLifeDoThresholdTool = createSimpleTool({
  calculate: (input) =>
    calculateShelfLifeDoThreshold(
      input as unknown as ShelfLifeDoThresholdInput,
    ),
  description:
    "Project the months of shelf life left before packaged wine consumes its oxygen budget at the observed pickup rate.",
  id: "oenology/shelf-life-do-threshold",
  inputs: [
    {
      description: "Dissolved plus headspace oxygen measured now.",
      id: "currentDoMgPerL",
      kind: "number",
      label: "Current oxygen",
      minimum: 0,
      unit: "mg/L",
    },
    {
      default: 3,
      description:
        "Oxygen the wine may absorb before it passes the flavor threshold.",
      id: "oxygenBudgetMgPerL",
      kind: "number",
      label: "Oxygen budget",
      minimum: 0,
      unit: "mg/L",
    },
    {
      default: 0.2,
      description:
        "Milligrams per liter of oxygen the package picks up each month.",
      id: "uptakeMgPerLPerMonth",
      kind: "number",
      label: "Monthly uptake",
      minimum: 0,
      unit: "mg/L/mo",
    },
  ],
  outputs: [
    {
      description:
        "Months until the package reaches its oxygen budget; floored at zero.",
      id: "monthsRemaining",
      kind: "number",
      label: "Months remaining",
    },
  ],
  title: "Shelf Life DO Threshold Predictor",
});
export const runShelfLifeDoThreshold = shelfLifeDoThresholdTool.execute;
export default shelfLifeDoThresholdTool;
