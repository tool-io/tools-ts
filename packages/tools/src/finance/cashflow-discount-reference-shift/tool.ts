import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly discountedValue: number;
  readonly suppliedPeriodicRate: number;
  readonly referenceShiftPeriods: number;
};
export type Output = { readonly rebasedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountedValue: { type: "number" },
    suppliedPeriodicRate: { type: "number", exclusiveMinimum: -1 },
    referenceShiftPeriods: { type: "number" },
  },
  required: [
    "discountedValue",
    "suppliedPeriodicRate",
    "referenceShiftPeriods",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rebasedValue: { type: "number" } },
  required: ["rebasedValue"],
} as const;
/** Move an explicit discounted value forward by a supplied signed period shift under a constant effective rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { discountedValue, suppliedPeriodicRate, referenceShiftPeriods } =
    request;
  const compute = (): Output => {
    H.domain(suppliedPeriodicRate > -1, "suppliedPeriodicRate");
    return {
      rebasedValue:
        discountedValue *
        Math.pow(1 + suppliedPeriodicRate, referenceShiftPeriods),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    discountedValue: 100,
    suppliedPeriodicRate: 0.1,
    referenceShiftPeriods: 2,
  },
  output: { rebasedValue: 121.00000000000001 },
} satisfies ToolExample<Input, Output>;
export const cashflowDiscountReferenceShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["finance", "business and finance"],
      keywords: ["finance", "business and finance"],
    },
    id: "finance/cashflow-discount-reference-shift",
    title: "Cashflow Discount Reference Shift",
    description:
      "Move an explicit discounted value forward by a supplied signed period shift under a constant effective rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountedValue: { type: "number" },
        suppliedPeriodicRate: { type: "number", exclusiveMinimum: -1 },
        referenceShiftPeriods: { type: "number" },
      },
      required: [
        "discountedValue",
        "suppliedPeriodicRate",
        "referenceShiftPeriods",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rebasedValue: { type: "number" } },
      required: ["rebasedValue"],
    },
    ports: {
      inputs: [
        {
          id: "discountedValue",
          label: "Discounted Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPeriodicRate",
          label: "Supplied Periodic Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceShiftPeriods",
          label: "Reference Shift Periods",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rebasedValue",
          label: "Rebased Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cashflowDiscountReferenceShiftTool.execute;
export default cashflowDiscountReferenceShiftTool;
