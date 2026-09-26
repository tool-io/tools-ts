import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashRent: number;
  readonly inKindQuantity: number;
  readonly inKindUnitPrice: number;
  readonly dailyWage: number;
};
export type Output = { readonly totalRent: number; readonly wageDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashRent: { type: "number" },
    inKindQuantity: { type: "number", minimum: 0 },
    inKindUnitPrice: { type: "number" },
    dailyWage: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cashRent", "inKindQuantity", "inKindUnitPrice", "dailyWage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalRent: { type: "number" }, wageDays: { type: "number" } },
  required: ["totalRent", "wageDays"],
} as const;
/** Calculate historical rent wage day equivalent from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashRent, inKindQuantity, inKindUnitPrice, dailyWage } = request;
  const compute = (): Output => {
    H.positive(dailyWage);
    H.domain(inKindQuantity >= 0);
    return {
      totalRent: cashRent + inKindQuantity * inKindUnitPrice,
      wageDays: (cashRent + inKindQuantity * inKindUnitPrice) / dailyWage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashRent: 20, inKindQuantity: 5, inKindUnitPrice: 2, dailyWage: 3 },
  output: { totalRent: 30, wageDays: 10 },
} satisfies ToolExample<Input, Output>;
export const historicalRentWageDayEquivalentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historical-rent-wage-day-equivalent",
    title: "Historical Rent Wage Day Equivalent Tool",
    description:
      "Calculate historical rent wage day equivalent from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashRent: { type: "number" },
        inKindQuantity: { type: "number", minimum: 0 },
        inKindUnitPrice: { type: "number" },
        dailyWage: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cashRent", "inKindQuantity", "inKindUnitPrice", "dailyWage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRent: { type: "number" },
        wageDays: { type: "number" },
      },
      required: ["totalRent", "wageDays"],
    },
    ports: {
      inputs: [
        {
          id: "cashRent",
          label: "Cash Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inKindQuantity",
          label: "In Kind Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inKindUnitPrice",
          label: "In Kind Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyWage",
          label: "Daily Wage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalRent", label: "Total Rent", valueType: { type: "number" } },
        { id: "wageDays", label: "Wage Days", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = historicalRentWageDayEquivalentTool.execute;
export default historicalRentWageDayEquivalentTool;
