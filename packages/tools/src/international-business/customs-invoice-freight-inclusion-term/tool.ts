import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goodsValue: number;
  readonly freightAmount: number;
  readonly includeFreight: boolean;
};
export type Output = { readonly selectedInvoiceBase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goodsValue: { type: "number", minimum: 0 },
    freightAmount: { type: "number", minimum: 0 },
    includeFreight: { type: "boolean" },
  },
  required: ["goodsValue", "freightAmount", "includeFreight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { selectedInvoiceBase: { type: "number" } },
  required: ["selectedInvoiceBase"],
} as const;
/** Choose an explicit goods-plus-freight or goods-only invoice base without deciding customs valuation rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goodsValue, freightAmount, includeFreight } = request;
  const compute = (): Output => {
    H.domain(goodsValue >= 0, "goodsValue");
    H.domain(freightAmount >= 0, "freightAmount");
    return {
      selectedInvoiceBase: goodsValue + (includeFreight ? freightAmount : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goodsValue: 1000, freightAmount: 100, includeFreight: true },
  output: { selectedInvoiceBase: 1100 },
} satisfies ToolExample<Input, Output>;
export const customsInvoiceFreightInclusionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/customs-invoice-freight-inclusion-term",
    title: "Customs Invoice Freight Inclusion Term Tool",
    description:
      "Choose an explicit goods-plus-freight or goods-only invoice base without deciding customs valuation rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goodsValue: { type: "number", minimum: 0 },
        freightAmount: { type: "number", minimum: 0 },
        includeFreight: { type: "boolean" },
      },
      required: ["goodsValue", "freightAmount", "includeFreight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { selectedInvoiceBase: { type: "number" } },
      required: ["selectedInvoiceBase"],
    },
    ports: {
      inputs: [
        {
          id: "goodsValue",
          label: "Goods Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freightAmount",
          label: "Freight Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeFreight",
          label: "Include Freight",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "selectedInvoiceBase",
          label: "Selected Invoice Base",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = customsInvoiceFreightInclusionTermTool.execute;
export default customsInvoiceFreightInclusionTermTool;
