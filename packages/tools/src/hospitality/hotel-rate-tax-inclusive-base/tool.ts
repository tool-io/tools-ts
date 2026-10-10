import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossRate: number;
  readonly suppliedNetBasedTaxFraction: number;
};
export type Output = { readonly netRate: number; readonly taxAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRate: { type: "number" },
    suppliedNetBasedTaxFraction: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["grossRate", "suppliedNetBasedTaxFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netRate: { type: "number" }, taxAmount: { type: "number" } },
  required: ["netRate", "taxAmount"],
} as const;
/** Split an explicit tax-inclusive hotel rate using a supplied net-based tax fraction without selecting tax rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossRate, suppliedNetBasedTaxFraction } = request;
  const compute = (): Output => {
    H.domain(suppliedNetBasedTaxFraction > -1, "suppliedNetBasedTaxFraction");
    return {
      netRate: grossRate / (1 + suppliedNetBasedTaxFraction),
      taxAmount: grossRate - grossRate / (1 + suppliedNetBasedTaxFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossRate: 120, suppliedNetBasedTaxFraction: 0.2 },
  output: { netRate: 100, taxAmount: 20 },
} satisfies ToolExample<Input, Output>;
export const hotelRateTaxInclusiveBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospitality", "business and finance"],
      keywords: ["hospitality", "business and finance"],
    },
    id: "hospitality/hotel-rate-tax-inclusive-base",
    title: "Hotel Rate Tax Inclusive Base",
    description:
      "Split an explicit tax-inclusive hotel rate using a supplied net-based tax fraction without selecting tax rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRate: { type: "number" },
        suppliedNetBasedTaxFraction: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["grossRate", "suppliedNetBasedTaxFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netRate: { type: "number" },
        taxAmount: { type: "number" },
      },
      required: ["netRate", "taxAmount"],
    },
    ports: {
      inputs: [
        {
          id: "grossRate",
          label: "Gross Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedNetBasedTaxFraction",
          label: "Supplied Net Based Tax Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netRate", label: "Net Rate", valueType: { type: "number" } },
        { id: "taxAmount", label: "Tax Amount", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hotelRateTaxInclusiveBaseTool.execute;
export default hotelRateTaxInclusiveBaseTool;
