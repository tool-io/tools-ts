import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly usableStock: number;
  readonly dailyDraw: number;
  readonly reservedStock: number;
  readonly excludeReserve: boolean;
};
export type Output = {
  readonly stockBase: number;
  readonly durationDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableStock: { type: "number", minimum: 0 },
    dailyDraw: { type: "number", exclusiveMinimum: 0 },
    reservedStock: { type: "number", minimum: 0 },
    excludeReserve: { type: "boolean" },
  },
  required: ["usableStock", "dailyDraw", "reservedStock", "excludeReserve"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockBase: { type: "number" },
    durationDays: { type: "number" },
  },
  required: ["stockBase", "durationDays"],
} as const;
/** Divide supplied usable stock by explicit constant daily draw; no nutrition adequacy or assistance eligibility claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { usableStock, dailyDraw, reservedStock, excludeReserve } = request;
  const compute = (): Output => {
    H.positive(dailyDraw);
    H.domain(
      usableStock >= 0 && reservedStock >= 0 && reservedStock <= usableStock,
    );
    return {
      stockBase: usableStock - (excludeReserve ? reservedStock : 0),
      durationDays:
        (usableStock - (excludeReserve ? reservedStock : 0)) / dailyDraw,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    usableStock: 100,
    dailyDraw: 10,
    reservedStock: 20,
    excludeReserve: true,
  },
  output: { stockBase: 80, durationDays: 8 },
} satisfies ToolExample<Input, Output>;
export const householdFoodStockDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/household-food-stock-duration",
    title: "Household Food Stock Duration Tool",
    description:
      "Divide supplied usable stock by explicit constant daily draw; no nutrition adequacy or assistance eligibility claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableStock: { type: "number", minimum: 0 },
        dailyDraw: { type: "number", exclusiveMinimum: 0 },
        reservedStock: { type: "number", minimum: 0 },
        excludeReserve: { type: "boolean" },
      },
      required: ["usableStock", "dailyDraw", "reservedStock", "excludeReserve"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockBase: { type: "number" },
        durationDays: { type: "number" },
      },
      required: ["stockBase", "durationDays"],
    },
    ports: {
      inputs: [
        {
          id: "usableStock",
          label: "Usable Stock",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyDraw",
          label: "Daily Draw",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedStock",
          label: "Reserved Stock",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeReserve",
          label: "Exclude Reserve",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "stockBase", label: "Stock Base", valueType: { type: "number" } },
        {
          id: "durationDays",
          label: "Duration Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdFoodStockDurationTool.execute;
export default householdFoodStockDurationTool;
