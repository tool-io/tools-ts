import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly namespace: string;
  readonly tokenName: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    namespace: { type: "string", maxLength: 8192, minLength: 1 },
    tokenName: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["namespace", "tokenName", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied design-token name by namespace and version without resolving token values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { namespace, tokenName, version } = request;
  const compute = (): Output => {
    H.domain(namespace.length > 0, "namespace");
    H.domain(tokenName.length > 0, "tokenName");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([namespace, tokenName, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { namespace: "brand", tokenName: "color.accent", version: "v2" },
  output: { token: '["brand","color.accent","v2"]' },
} satisfies ToolExample<Input, Output>;
export const designTokenReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["graphic-design", "graphic design", "arts and design"],
      keywords: ["graphic design", "arts and design"],
    },
    id: "graphic-design/design-token-reference-label",
    title: "Design Token Reference Label",
    description:
      "Qualify a supplied design-token name by namespace and version without resolving token values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        namespace: { type: "string", maxLength: 8192, minLength: 1 },
        tokenName: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["namespace", "tokenName", "version"],
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
          id: "namespace",
          label: "Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "tokenName",
          label: "Token Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = designTokenReferenceLabelTool.execute;
export default designTokenReferenceLabelTool;
