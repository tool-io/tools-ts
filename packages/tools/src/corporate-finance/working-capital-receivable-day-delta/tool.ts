import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualCreditSales: number;
  readonly beforeReceivableDays: number;
  readonly afterReceivableDays: number;
  readonly yearDays: number;
};
export type Output = { readonly receivablesChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualCreditSales: { type: "number", minimum: 0 },
    beforeReceivableDays: { type: "number", minimum: 0 },
    afterReceivableDays: { type: "number", minimum: 0 },
    yearDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "annualCreditSales",
    "beforeReceivableDays",
    "afterReceivableDays",
    "yearDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { receivablesChange: { type: "number" } },
  required: ["receivablesChange"],
} as const;
/** Estimate receivables cash tied up by a supplied days change under uniform credit sales and an explicit year-day convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    annualCreditSales,
    beforeReceivableDays,
    afterReceivableDays,
    yearDays,
  } = request;
  const compute = (): Output => {
    H.domain(
      annualCreditSales >= 0 &&
        beforeReceivableDays >= 0 &&
        afterReceivableDays >= 0,
      "annualCreditSales",
    );
    (H.domain(yearDays > 0, "yearDays"), yearDays);
    return {
      receivablesChange:
        (annualCreditSales / yearDays) *
        (afterReceivableDays - beforeReceivableDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    annualCreditSales: 365000,
    beforeReceivableDays: 30,
    afterReceivableDays: 40,
    yearDays: 365,
  },
  output: { receivablesChange: 10000 },
} satisfies ToolExample<Input, Output>;
export const workingCapitalReceivableDayDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/working-capital-receivable-day-delta",
    title: "Working Capital Receivable Day Delta",
    description:
      "Estimate receivables cash tied up by a supplied days change under uniform credit sales and an explicit year-day convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annualCreditSales: { type: "number", minimum: 0 },
        beforeReceivableDays: { type: "number", minimum: 0 },
        afterReceivableDays: { type: "number", minimum: 0 },
        yearDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "annualCreditSales",
        "beforeReceivableDays",
        "afterReceivableDays",
        "yearDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { receivablesChange: { type: "number" } },
      required: ["receivablesChange"],
    },
    ports: {
      inputs: [
        {
          id: "annualCreditSales",
          label: "Annual Credit Sales",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beforeReceivableDays",
          label: "Before Receivable Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterReceivableDays",
          label: "After Receivable Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "receivablesChange",
          label: "Receivables Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = workingCapitalReceivableDayDeltaTool.execute;
export default workingCapitalReceivableDayDeltaTool;
