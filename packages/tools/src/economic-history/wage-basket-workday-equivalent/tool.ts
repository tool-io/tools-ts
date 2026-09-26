import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dailyWage: number;
  readonly suppliedBasketCost: number;
  readonly paidDaysPerWorkday: number;
};
export type Output = { readonly workdayEquivalent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dailyWage: { type: "number", exclusiveMinimum: 0 },
    suppliedBasketCost: { type: "number", minimum: 0 },
    paidDaysPerWorkday: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dailyWage", "suppliedBasketCost", "paidDaysPerWorkday"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { workdayEquivalent: { type: "number" } },
  required: ["workdayEquivalent"],
} as const;
/** Express supplied basket cost in wage-day equivalents under an explicit paid-day basis, without selecting a historical basket. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dailyWage, suppliedBasketCost, paidDaysPerWorkday } = request;
  const compute = (): Output => {
    H.positive(dailyWage);
    H.positive(paidDaysPerWorkday);
    H.domain(suppliedBasketCost >= 0);
    return {
      workdayEquivalent: suppliedBasketCost / (dailyWage * paidDaysPerWorkday),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dailyWage: 10, suppliedBasketCost: 50, paidDaysPerWorkday: 1 },
  output: { workdayEquivalent: 5 },
} satisfies ToolExample<Input, Output>;
export const wageBasketWorkdayEquivalentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/wage-basket-workday-equivalent",
    title: "Wage Basket Workday Equivalent Tool",
    description:
      "Express supplied basket cost in wage-day equivalents under an explicit paid-day basis, without selecting a historical basket.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dailyWage: { type: "number", exclusiveMinimum: 0 },
        suppliedBasketCost: { type: "number", minimum: 0 },
        paidDaysPerWorkday: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dailyWage", "suppliedBasketCost", "paidDaysPerWorkday"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { workdayEquivalent: { type: "number" } },
      required: ["workdayEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "dailyWage",
          label: "Daily Wage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBasketCost",
          label: "Supplied Basket Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paidDaysPerWorkday",
          label: "Paid Days Per Workday",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "workdayEquivalent",
          label: "Workday Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wageBasketWorkdayEquivalentTool.execute;
export default wageBasketWorkdayEquivalentTool;
