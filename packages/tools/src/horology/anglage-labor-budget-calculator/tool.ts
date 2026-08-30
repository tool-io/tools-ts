import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnglageLaborBudgetInput = {
  readonly laborRatePerHour: number;
  readonly partCount: number;
  readonly quotedHoursPerPart: number;
  readonly setupHours: number;
};

export type AnglageLaborBudgetOutput = {
  readonly laborCost: number;
  readonly totalHours: number;
  readonly totalHoursIncludingSetup: number;
};

export const calculateAnglageLaborBudget = (
  input: AnglageLaborBudgetInput,
): AnglageLaborBudgetOutput => {
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
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Labor inputs must be finite and nonnegative.",
        "labor_input_invalid",
      );
  const totalHours = input.partCount * input.quotedHoursPerPart;
  const totalHoursIncludingSetup = totalHours + input.setupHours;
  return {
    laborCost: totalHoursIncludingSetup * input.laborRatePerHour,
    totalHours,
    totalHoursIncludingSetup,
  };
};

export const anglageLaborBudgetExample = {
  input: {
    laborRatePerHour: 120,
    partCount: 8,
    quotedHoursPerPart: 3,
    setupHours: 4,
  },
  output: {
    laborCost: 3360,
    totalHours: 24,
    totalHoursIncludingSetup: 28,
  },
} satisfies ToolExample<AnglageLaborBudgetInput, AnglageLaborBudgetOutput>;

export const anglageLaborBudgetTool = createSimpleTool({
  calculate: (input) =>
    calculateAnglageLaborBudget({
      laborRatePerHour: input.laborRatePerHour as number,
      partCount: input.partCount as number,
      quotedHoursPerPart: input.quotedHoursPerPart as number,
      setupHours: input.setupHours as number,
    }),
  description:
    "Calculate an anglage labor budget from maker- or supplier-quoted hours; it does not invent a universal hours-per-part estimate.",
  id: "horology/anglage-labor-budget-calculator",
  inputs: [
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
      label: "Quoted beveling hours per part",
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
      id: "laborCost",
      kind: "number",
      label: "Calculated labor cost",
      minimum: 0,
    },
    {
      id: "totalHours",
      kind: "number",
      label: "Per-part labor hours",
      minimum: 0,
      unit: "h",
    },
    {
      id: "totalHoursIncludingSetup",
      kind: "number",
      label: "Labor hours including setup",
      minimum: 0,
      unit: "h",
    },
  ],
  title: "Anglage Labor Budget Calculator",
});

export const runAnglageLaborBudget = anglageLaborBudgetTool.execute;
export default anglageLaborBudgetTool;
