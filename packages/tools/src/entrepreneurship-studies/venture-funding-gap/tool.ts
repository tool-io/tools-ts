import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFunding: number;
  readonly securedFunding: number;
};
export type Output = { readonly shortfall: number; readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFunding: { type: "number", minimum: 0 },
    securedFunding: { type: "number", minimum: 0 },
  },
  required: ["requiredFunding", "securedFunding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortfall: { type: "number" }, surplus: { type: "number" } },
  required: ["shortfall", "surplus"],
} as const;
/** Compare an explicit funding requirement with secured funding in the same currency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFunding, securedFunding } = request;
  const compute = (): Output => {
    H.domain(requiredFunding >= 0 && securedFunding >= 0, "requiredFunding");
    return {
      shortfall: Math.max(0, requiredFunding - securedFunding),
      surplus: Math.max(0, securedFunding - requiredFunding),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredFunding: 120000, securedFunding: 85000 },
  output: { shortfall: 35000, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const ventureFundingGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/venture-funding-gap",
    title: "Venture Funding Gap",
    description:
      "Compare an explicit funding requirement with secured funding in the same currency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFunding: { type: "number", minimum: 0 },
        securedFunding: { type: "number", minimum: 0 },
      },
      required: ["requiredFunding", "securedFunding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "number" },
        surplus: { type: "number" },
      },
      required: ["shortfall", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "requiredFunding",
          label: "Required Funding",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "securedFunding",
          label: "Secured Funding",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ventureFundingGapTool.execute;
export default ventureFundingGapTool;
