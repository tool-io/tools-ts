import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly days: number;
  readonly standingPerDay: number;
  readonly kwh: number;
  readonly pricePerKwh: number;
  readonly taxRate: number;
};
export type Output = {
  readonly standing: number;
  readonly variable: number;
  readonly tax: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    days: { type: "integer", minimum: 0 },
    standingPerDay: { type: "number" },
    kwh: { type: "number", minimum: 0 },
    pricePerKwh: { type: "number" },
    taxRate: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["days", "standingPerDay", "kwh", "pricePerKwh", "taxRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standing: { type: "number" },
    variable: { type: "number" },
    tax: { type: "number" },
    total: { type: "number" },
  },
  required: ["standing", "variable", "tax", "total"],
} as const;
/** Flat standing and volumetric charges with one explicitly supplied tax applied to their combined base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { days, standingPerDay, kwh, pricePerKwh, taxRate } = request;
  const compute = (): Output => {
    H.integer(days, 0);
    H.domain(kwh >= 0 && taxRate > -1);
    return {
      standing: days * standingPerDay,
      variable: kwh * pricePerKwh,
      tax: (days * standingPerDay + kwh * pricePerKwh) * taxRate,
      total: (days * standingPerDay + kwh * pricePerKwh) * (1 + taxRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    days: 30,
    standingPerDay: 1,
    kwh: 200,
    pricePerKwh: 0.2,
    taxRate: 0.1,
  },
  output: { standing: 30, variable: 40, tax: 7, total: 77 },
} satisfies ToolExample<Input, Output>;
export const electricityBillStandingVariableSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "energy-economics/electricity-bill-standing-variable-split",
      title: "Electricity Bill Standing Variable Split Tool",
      description:
        "Flat standing and volumetric charges with one explicitly supplied tax applied to their combined base.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          days: { type: "integer", minimum: 0 },
          standingPerDay: { type: "number" },
          kwh: { type: "number", minimum: 0 },
          pricePerKwh: { type: "number" },
          taxRate: { type: "number", exclusiveMinimum: -1 },
        },
        required: ["days", "standingPerDay", "kwh", "pricePerKwh", "taxRate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standing: { type: "number" },
          variable: { type: "number" },
          tax: { type: "number" },
          total: { type: "number" },
        },
        required: ["standing", "variable", "tax", "total"],
      },
      ports: {
        inputs: [
          {
            id: "days",
            label: "Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "standingPerDay",
            label: "Standing Per Day",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "kwh",
            label: "Kwh",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pricePerKwh",
            label: "Price Per Kwh",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "taxRate",
            label: "Tax Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "standing", label: "Standing", valueType: { type: "number" } },
          { id: "variable", label: "Variable", valueType: { type: "number" } },
          { id: "tax", label: "Tax", valueType: { type: "number" } },
          { id: "total", label: "Total", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = electricityBillStandingVariableSplitTool.execute;
export default electricityBillStandingVariableSplitTool;
