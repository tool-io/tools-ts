import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly familyHours: number;
  readonly suppliedHourlyValue: number;
  readonly accountingProfit: number;
};
export type Output = {
  readonly imputedLaborCost: number;
  readonly residualProfit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    familyHours: { type: "number", minimum: 0 },
    suppliedHourlyValue: { type: "number", minimum: 0 },
    accountingProfit: { type: "number" },
  },
  required: ["familyHours", "suppliedHourlyValue", "accountingProfit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imputedLaborCost: { type: "number" },
    residualProfit: { type: "number" },
  },
  required: ["imputedLaborCost", "residualProfit"],
} as const;
/** Calculate farm family labor imputed cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { familyHours, suppliedHourlyValue, accountingProfit } = request;
  const compute = (): Output => {
    H.domain(familyHours >= 0 && suppliedHourlyValue >= 0);
    return {
      imputedLaborCost: familyHours * suppliedHourlyValue,
      residualProfit: accountingProfit - familyHours * suppliedHourlyValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { familyHours: 100, suppliedHourlyValue: 15, accountingProfit: 2000 },
  output: { imputedLaborCost: 1500, residualProfit: 500 },
} satisfies ToolExample<Input, Output>;
export const farmFamilyLaborImputedCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/farm-family-labor-imputed-cost",
    title: "Farm Family Labor Imputed Cost Tool",
    description:
      "Calculate farm family labor imputed cost from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        familyHours: { type: "number", minimum: 0 },
        suppliedHourlyValue: { type: "number", minimum: 0 },
        accountingProfit: { type: "number" },
      },
      required: ["familyHours", "suppliedHourlyValue", "accountingProfit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imputedLaborCost: { type: "number" },
        residualProfit: { type: "number" },
      },
      required: ["imputedLaborCost", "residualProfit"],
    },
    ports: {
      inputs: [
        {
          id: "familyHours",
          label: "Family Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHourlyValue",
          label: "Supplied Hourly Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accountingProfit",
          label: "Accounting Profit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "imputedLaborCost",
          label: "Imputed Labor Cost",
          valueType: { type: "number" },
        },
        {
          id: "residualProfit",
          label: "Residual Profit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmFamilyLaborImputedCostTool.execute;
export default farmFamilyLaborImputedCostTool;
