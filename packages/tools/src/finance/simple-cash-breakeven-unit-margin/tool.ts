import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fixedCashCost: number;
  readonly unitSellingPrice: number;
  readonly unitVariableCashCost: number;
};
export type Output = {
  readonly contributionPerUnit: number;
  readonly breakEvenUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedCashCost: { type: "number", minimum: 0 },
    unitSellingPrice: { type: "number" },
    unitVariableCashCost: { type: "number", minimum: 0 },
  },
  required: ["fixedCashCost", "unitSellingPrice", "unitVariableCashCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contributionPerUnit: { type: "number" },
    breakEvenUnits: { type: "number" },
  },
  required: ["contributionPerUnit", "breakEvenUnits"],
} as const;
/** Compute continuous-unit cash break-even from fixed cash outlays and a positive unit cash contribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fixedCashCost, unitSellingPrice, unitVariableCashCost } = request;
  const compute = (): Output => {
    H.domain(
      fixedCashCost >= 0 &&
        unitVariableCashCost >= 0 &&
        unitSellingPrice > unitVariableCashCost,
      "fixedCashCost",
    );
    return {
      contributionPerUnit: unitSellingPrice - unitVariableCashCost,
      breakEvenUnits: fixedCashCost / (unitSellingPrice - unitVariableCashCost),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fixedCashCost: 1200,
    unitSellingPrice: 25,
    unitVariableCashCost: 10,
  },
  output: { contributionPerUnit: 15, breakEvenUnits: 80 },
} satisfies ToolExample<Input, Output>;
export const simpleCashBreakevenUnitMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/simple-cash-breakeven-unit-margin",
    title: "Simple Cash Breakeven Unit Margin Tool",
    description:
      "Compute continuous-unit cash break-even from fixed cash outlays and a positive unit cash contribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedCashCost: { type: "number", minimum: 0 },
        unitSellingPrice: { type: "number" },
        unitVariableCashCost: { type: "number", minimum: 0 },
      },
      required: ["fixedCashCost", "unitSellingPrice", "unitVariableCashCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contributionPerUnit: { type: "number" },
        breakEvenUnits: { type: "number" },
      },
      required: ["contributionPerUnit", "breakEvenUnits"],
    },
    ports: {
      inputs: [
        {
          id: "fixedCashCost",
          label: "Fixed Cash Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitSellingPrice",
          label: "Unit Selling Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitVariableCashCost",
          label: "Unit Variable Cash Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contributionPerUnit",
          label: "Contribution Per Unit",
          valueType: { type: "number" },
        },
        {
          id: "breakEvenUnits",
          label: "Break Even Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = simpleCashBreakevenUnitMarginTool.execute;
export default simpleCashBreakevenUnitMarginTool;
