import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bill: number;
  readonly income: number;
  readonly housingCost: number;
  readonly afterHousing: boolean;
};
export type Output = { readonly incomeBase: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bill: { type: "number", minimum: 0 },
    income: { type: "number" },
    housingCost: { type: "number", minimum: 0 },
    afterHousing: { type: "boolean" },
  },
  required: ["bill", "income", "housingCost", "afterHousing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { incomeBase: { type: "number" }, share: { type: "number" } },
  required: ["incomeBase", "share"],
} as const;
/** Energy expenditure share under an explicit income denominator; no poverty threshold or jurisdictional classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bill, income, housingCost, afterHousing } = request;
  const compute = (): Output => {
    H.domain(
      bill >= 0 &&
        housingCost >= 0 &&
        income - (afterHousing ? housingCost : 0) > 0,
    );
    return {
      incomeBase: income - (afterHousing ? housingCost : 0),
      share: bill / (income - (afterHousing ? housingCost : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bill: 120, income: 1000, housingCost: 400, afterHousing: true },
  output: { incomeBase: 600, share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const energyPovertyBillIncomeShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/energy-poverty-bill-income-share-term",
    title: "Energy Poverty Bill Income Share Term Tool",
    description:
      "Energy expenditure share under an explicit income denominator; no poverty threshold or jurisdictional classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bill: { type: "number", minimum: 0 },
        income: { type: "number" },
        housingCost: { type: "number", minimum: 0 },
        afterHousing: { type: "boolean" },
      },
      required: ["bill", "income", "housingCost", "afterHousing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { incomeBase: { type: "number" }, share: { type: "number" } },
      required: ["incomeBase", "share"],
    },
    ports: {
      inputs: [
        {
          id: "bill",
          label: "Bill",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "income",
          label: "Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "housingCost",
          label: "Housing Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterHousing",
          label: "After Housing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "incomeBase",
          label: "Income Base",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = energyPovertyBillIncomeShareTermTool.execute;
export default energyPovertyBillIncomeShareTermTool;
