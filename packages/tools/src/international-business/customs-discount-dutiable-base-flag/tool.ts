import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceValue: number;
  readonly discount: number;
  readonly freight: number;
  readonly discountAllowed: boolean;
  readonly freightIncluded: boolean;
};
export type Output = { readonly base: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceValue: { type: "number", minimum: 0 },
    discount: { type: "number", minimum: 0 },
    freight: { type: "number", minimum: 0 },
    discountAllowed: { type: "boolean" },
    freightIncluded: { type: "boolean" },
  },
  required: [
    "invoiceValue",
    "discount",
    "freight",
    "discountAllowed",
    "freightIncluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { base: { type: "number" } },
  required: ["base"],
} as const;
/** Caller-selected valuation components only, without determining customs law or classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceValue, discount, freight, discountAllowed, freightIncluded } =
    request;
  const compute = (): Output => {
    H.domain(
      invoiceValue >= 0 &&
        discount >= 0 &&
        discount <= invoiceValue &&
        freight >= 0,
    );
    return {
      base:
        invoiceValue -
        (discountAllowed ? discount : 0) +
        (freightIncluded ? freight : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invoiceValue: 100,
    discount: 10,
    freight: 20,
    discountAllowed: true,
    freightIncluded: true,
  },
  output: { base: 110 },
} satisfies ToolExample<Input, Output>;
export const customsDiscountDutiableBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/customs-discount-dutiable-base-flag",
    title: "Customs Discount Dutiable Base Flag Tool",
    description:
      "Caller-selected valuation components only, without determining customs law or classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceValue: { type: "number", minimum: 0 },
        discount: { type: "number", minimum: 0 },
        freight: { type: "number", minimum: 0 },
        discountAllowed: { type: "boolean" },
        freightIncluded: { type: "boolean" },
      },
      required: [
        "invoiceValue",
        "discount",
        "freight",
        "discountAllowed",
        "freightIncluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { base: { type: "number" } },
      required: ["base"],
    },
    ports: {
      inputs: [
        {
          id: "invoiceValue",
          label: "Invoice Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discount",
          label: "Discount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freight",
          label: "Freight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountAllowed",
          label: "Discount Allowed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "freightIncluded",
          label: "Freight Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "base", label: "Base", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = customsDiscountDutiableBaseFlagTool.execute;
export default customsDiscountDutiableBaseFlagTool;
