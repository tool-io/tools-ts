import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly policyCode: string;
  readonly sectionCode: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    policyCode: { type: "string", maxLength: 8192, minLength: 1 },
    sectionCode: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["policyCode", "sectionCode", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an explicit policy-edition-section reference as an unambiguous token without resolving its text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { policyCode, sectionCode, edition } = request;
  const compute = (): Output => {
    H.domain(
      policyCode.length > 0 && sectionCode.length > 0 && edition.length > 0,
      "policyCode",
    );
    return { token: JSON.stringify([policyCode, edition, sectionCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { policyCode: "POL-17", sectionCode: "4.2", edition: "v3" },
  output: { token: '["POL-17","v3","4.2"]' },
} satisfies ToolExample<Input, Output>;
export const policyCrossReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/policy-cross-reference-token",
    title: "Policy Cross Reference Token",
    description:
      "Encode an explicit policy-edition-section reference as an unambiguous token without resolving its text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        policyCode: { type: "string", maxLength: 8192, minLength: 1 },
        sectionCode: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["policyCode", "sectionCode", "edition"],
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
          id: "policyCode",
          label: "Policy Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sectionCode",
          label: "Section Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = policyCrossReferenceTokenTool.execute;
export default policyCrossReferenceTokenTool;
