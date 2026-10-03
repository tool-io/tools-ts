import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly guaranteeAmount: number;
  readonly monthlyRent: number;
  readonly monthlyOtherCharges: number;
};
export type Output = {
  readonly coveredMonths: number;
  readonly fullMonths: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guaranteeAmount: { type: "number", minimum: 0 },
    monthlyRent: { type: "number", minimum: 0 },
    monthlyOtherCharges: { type: "number", minimum: 0 },
  },
  required: ["guaranteeAmount", "monthlyRent", "monthlyOtherCharges"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredMonths: { type: "number" },
    fullMonths: { type: "integer" },
    remainder: { type: "number" },
  },
  required: ["coveredMonths", "fullMonths", "remainder"],
} as const;
/** Calculate lease guarantee month coverage term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { guaranteeAmount, monthlyRent, monthlyOtherCharges } = request;
  const compute = (): Output => {
    H.domain(
      guaranteeAmount >= 0 &&
        monthlyRent >= 0 &&
        monthlyOtherCharges >= 0 &&
        monthlyRent + monthlyOtherCharges > 0,
    );
    return {
      coveredMonths: guaranteeAmount / (monthlyRent + monthlyOtherCharges),
      fullMonths: Math.floor(
        guaranteeAmount / (monthlyRent + monthlyOtherCharges),
      ),
      remainder: guaranteeAmount % (monthlyRent + monthlyOtherCharges),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { guaranteeAmount: 5500, monthlyRent: 1000, monthlyOtherCharges: 100 },
  output: { coveredMonths: 5, fullMonths: 5, remainder: 0 },
} satisfies ToolExample<Input, Output>;
export const leaseGuaranteeMonthCoverageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/lease-guarantee-month-coverage-term",
    title: "Lease Guarantee Month Coverage Term Tool",
    description:
      "Calculate lease guarantee month coverage term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        guaranteeAmount: { type: "number", minimum: 0 },
        monthlyRent: { type: "number", minimum: 0 },
        monthlyOtherCharges: { type: "number", minimum: 0 },
      },
      required: ["guaranteeAmount", "monthlyRent", "monthlyOtherCharges"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredMonths: { type: "number" },
        fullMonths: { type: "integer" },
        remainder: { type: "number" },
      },
      required: ["coveredMonths", "fullMonths", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "guaranteeAmount",
          label: "Guarantee Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "monthlyRent",
          label: "Monthly Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "monthlyOtherCharges",
          label: "Monthly Other Charges",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredMonths",
          label: "Covered Months",
          valueType: { type: "number" },
        },
        {
          id: "fullMonths",
          label: "Full Months",
          valueType: { type: "integer" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = leaseGuaranteeMonthCoverageTermTool.execute;
export default leaseGuaranteeMonthCoverageTermTool;
