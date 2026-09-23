import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contractValue: number;
  readonly oneTimeFees: number;
  readonly termMonths: number;
  readonly monthlyServices: number;
};
export type Output = {
  readonly recurringContractValue: number;
  readonly normalizedMrr: number;
  readonly normalizedArr: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contractValue: { type: "number" },
    oneTimeFees: { type: "number", minimum: 0 },
    termMonths: { type: "number", exclusiveMinimum: 0 },
    monthlyServices: { type: "number", minimum: 0 },
  },
  required: ["contractValue", "oneTimeFees", "termMonths", "monthlyServices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recurringContractValue: { type: "number" },
    normalizedMrr: { type: "number" },
    normalizedArr: { type: "number" },
  },
  required: ["recurringContractValue", "normalizedMrr", "normalizedArr"],
} as const;
/** Straight-line contracted recurring normalization, without assuming revenue-recognition accounting treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contractValue, oneTimeFees, termMonths, monthlyServices } = request;
  const compute = (): Output => {
    H.domain(
      oneTimeFees >= 0 && contractValue >= oneTimeFees && monthlyServices >= 0,
    );
    H.positive(termMonths);
    return {
      recurringContractValue: contractValue - oneTimeFees,
      normalizedMrr:
        (contractValue - oneTimeFees) / termMonths + monthlyServices,
      normalizedArr:
        12 * ((contractValue - oneTimeFees) / termMonths + monthlyServices),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contractValue: 1200,
    oneTimeFees: 200,
    termMonths: 10,
    monthlyServices: 20,
  },
  output: {
    recurringContractValue: 1000,
    normalizedMrr: 120,
    normalizedArr: 1440,
  },
} satisfies ToolExample<Input, Output>;
export const termContractedRecurringRevenueMonthFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "business-analytics/term-contracted-recurring-revenue-month-factor",
      title: "Term Contracted Recurring Revenue Month Factor Tool",
      description:
        "Straight-line contracted recurring normalization, without assuming revenue-recognition accounting treatment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contractValue: { type: "number" },
          oneTimeFees: { type: "number", minimum: 0 },
          termMonths: { type: "number", exclusiveMinimum: 0 },
          monthlyServices: { type: "number", minimum: 0 },
        },
        required: [
          "contractValue",
          "oneTimeFees",
          "termMonths",
          "monthlyServices",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recurringContractValue: { type: "number" },
          normalizedMrr: { type: "number" },
          normalizedArr: { type: "number" },
        },
        required: ["recurringContractValue", "normalizedMrr", "normalizedArr"],
      },
      ports: {
        inputs: [
          {
            id: "contractValue",
            label: "Contract Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oneTimeFees",
            label: "One Time Fees",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "termMonths",
            label: "Term Months",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "monthlyServices",
            label: "Monthly Services",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "recurringContractValue",
            label: "Recurring Contract Value",
            valueType: { type: "number" },
          },
          {
            id: "normalizedMrr",
            label: "Normalized Mrr",
            valueType: { type: "number" },
          },
          {
            id: "normalizedArr",
            label: "Normalized Arr",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = termContractedRecurringRevenueMonthFactorTool.execute;
export default termContractedRecurringRevenueMonthFactorTool;
