import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly suppliedCountryCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCountryCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "suppliedCountryCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit registration country code by its supplied code source without mapping jurisdictions or registration status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, suppliedCountryCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(suppliedCountryCode.length > 0, "suppliedCountryCode");
    H.domain(codeSource.length > 0, "codeSource");
    return {
      token: JSON.stringify([productId, suppliedCountryCode, codeSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productId: "PR17",
    suppliedCountryCode: "XX",
    codeSource: "Local codebook A",
  },
  output: { token: '["PR17","XX","Local codebook A"]' },
} satisfies ToolExample<Input, Output>;
export const productRegistrationCountryCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "regulatory-affairs",
        "regulatory affairs",
        "research and quality management",
      ],
      keywords: ["regulatory affairs", "research and quality management"],
    },
    id: "regulatory-affairs/product-registration-country-code",
    title: "Product Registration Country Code",
    description:
      "Qualify an explicit registration country code by its supplied code source without mapping jurisdictions or registration status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCountryCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "suppliedCountryCode", "codeSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "productId",
          label: "Product Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCountryCode",
          label: "Supplied Country Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = productRegistrationCountryCodeTool.execute;
export default productRegistrationCountryCodeTool;
