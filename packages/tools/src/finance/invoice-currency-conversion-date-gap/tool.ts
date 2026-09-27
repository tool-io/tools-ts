import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceDay: number;
  readonly rateDay: number;
  readonly maxAgeDays: number;
};
export type Output = {
  readonly ageDays: number;
  readonly futureDated: boolean;
  readonly withinSuppliedAge: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceDay: { type: "integer" },
    rateDay: { type: "integer" },
    maxAgeDays: { type: "integer", minimum: 0 },
  },
  required: ["invoiceDay", "rateDay", "maxAgeDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    futureDated: { type: "boolean" },
    withinSuppliedAge: { type: "boolean" },
  },
  required: ["ageDays", "futureDated", "withinSuppliedAge"],
} as const;
/** Compare supplied day indices without selecting or fetching an exchange rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceDay, rateDay, maxAgeDays } = request;
  const compute = (): Output => {
    H.integer(maxAgeDays, 0);
    return {
      ageDays: invoiceDay - rateDay,
      futureDated: rateDay > invoiceDay,
      withinSuppliedAge:
        invoiceDay >= rateDay && invoiceDay - rateDay <= maxAgeDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { invoiceDay: 100, rateDay: 98, maxAgeDays: 3 },
  output: { ageDays: 2, futureDated: false, withinSuppliedAge: true },
} satisfies ToolExample<Input, Output>;
export const invoiceCurrencyConversionDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/invoice-currency-conversion-date-gap",
    title: "Invoice Currency Conversion Date Gap Tool",
    description:
      "Compare supplied day indices without selecting or fetching an exchange rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceDay: { type: "integer" },
        rateDay: { type: "integer" },
        maxAgeDays: { type: "integer", minimum: 0 },
      },
      required: ["invoiceDay", "rateDay", "maxAgeDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        futureDated: { type: "boolean" },
        withinSuppliedAge: { type: "boolean" },
      },
      required: ["ageDays", "futureDated", "withinSuppliedAge"],
    },
    ports: {
      inputs: [
        {
          id: "invoiceDay",
          label: "Invoice Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rateDay",
          label: "Rate Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "maxAgeDays",
          label: "Max Age Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        {
          id: "futureDated",
          label: "Future Dated",
          valueType: { type: "boolean" },
        },
        {
          id: "withinSuppliedAge",
          label: "Within Supplied Age",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = invoiceCurrencyConversionDateGapTool.execute;
export default invoiceCurrencyConversionDateGapTool;
