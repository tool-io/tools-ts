import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BlackPolishLaborBudgetInput = {
  readonly contingencyPercent: number;
  readonly laborRatePerHour: number;
  readonly partCount: number;
  readonly quotedHoursPerPart: number;
  readonly setupHours: number;
};

export type BlackPolishLaborBudgetOutput = {
  readonly baseHours: number;
  readonly budgetedHours: number;
  readonly budgetedLaborCost: number;
};

export const calculateBlackPolishLaborBudget = (
  input: BlackPolishLaborBudgetInput,
): BlackPolishLaborBudgetOutput => {
  if (!Number.isSafeInteger(input.partCount) || input.partCount < 1)
    simpleError(
      "partCount",
      "Part count must be a positive safe integer.",
      "part_count_invalid",
    );
  for (const [field, value] of [
    ["quotedHoursPerPart", input.quotedHoursPerPart],
    ["setupHours", input.setupHours],
    ["laborRatePerHour", input.laborRatePerHour],
    ["contingencyPercent", input.contingencyPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Labor inputs must be finite and nonnegative.",
        "labor_input_invalid",
      );
  const baseHours =
    input.partCount * input.quotedHoursPerPart + input.setupHours;
  const budgetedHours = baseHours * (1 + input.contingencyPercent / 100);
  return {
    baseHours,
    budgetedHours,
    budgetedLaborCost: budgetedHours * input.laborRatePerHour,
  };
};

export const blackPolishLaborBudgetExample = {
  input: {
    contingencyPercent: 10,
    laborRatePerHour: 100,
    partCount: 4,
    quotedHoursPerPart: 2,
    setupHours: 2,
  },
  output: {
    baseHours: 10,
    budgetedHours: 11,
    budgetedLaborCost: 1100,
  },
} satisfies ToolExample<
  BlackPolishLaborBudgetInput,
  BlackPolishLaborBudgetOutput
>;

export const blackPolishLaborBudgetTool = createSimpleTool({
  calculate: (input) =>
    calculateBlackPolishLaborBudget({
      contingencyPercent: input.contingencyPercent as number,
      laborRatePerHour: input.laborRatePerHour as number,
      partCount: input.partCount as number,
      quotedHoursPerPart: input.quotedHoursPerPart as number,
      setupHours: input.setupHours as number,
    }),
  description:
    "Budget black-polishing labor from quoted hours and an explicit contingency percentage; it does not assert a universal finishing time or acceptance result.",
  id: "horology/black-polish-labor-budget-calculator",
  inputs: [
    {
      id: "contingencyPercent",
      kind: "number",
      label: "Explicit labor contingency",
      minimum: 0,
      unit: "%",
    },
    {
      id: "laborRatePerHour",
      kind: "number",
      label: "Quoted labor rate",
      minimum: 0,
    },
    { id: "partCount", kind: "integer", label: "Part count", minimum: 1 },
    {
      id: "quotedHoursPerPart",
      kind: "number",
      label: "Quoted black-polishing hours per part",
      minimum: 0,
      unit: "h",
    },
    {
      id: "setupHours",
      kind: "number",
      label: "Quoted setup hours",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      id: "baseHours",
      kind: "number",
      label: "Base quoted labor hours",
      minimum: 0,
      unit: "h",
    },
    {
      id: "budgetedHours",
      kind: "number",
      label: "Budgeted labor hours including contingency",
      minimum: 0,
      unit: "h",
    },
    {
      id: "budgetedLaborCost",
      kind: "number",
      label: "Budgeted labor cost",
      minimum: 0,
    },
  ],
  title: "Black Polish Labor Budget Calculator",
});

export const runBlackPolishLaborBudget = blackPolishLaborBudgetTool.execute;
export default blackPolishLaborBudgetTool;
