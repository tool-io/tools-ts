import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly signerId: string;
  readonly proxyForId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    signerId: { type: "string", maxLength: 8192, minLength: 1 },
    proxyForId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["documentId", "signerId", "proxyForId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit document signer and represented principal without establishing authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, signerId, proxyForId } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0, "documentId");
    H.domain(signerId.length > 0, "signerId");
    H.domain(proxyForId.length > 0, "proxyForId");
    return { token: JSON.stringify([documentId, signerId, proxyForId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "D17", signerId: "S2", proxyForId: "S1" },
  output: { token: '["D17","S2","S1"]' },
} satisfies ToolExample<Input, Output>;
export const administrativeSignerProxyRoleTool = H.defineSchemaCalculation<
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
    id: "administrative-science/administrative-signer-proxy-role",
    title: "Administrative Signer Proxy Role",
    description:
      "Record an explicit document signer and represented principal without establishing authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        signerId: { type: "string", maxLength: 8192, minLength: 1 },
        proxyForId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["documentId", "signerId", "proxyForId"],
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
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "signerId",
          label: "Signer Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "proxyForId",
          label: "Proxy For Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = administrativeSignerProxyRoleTool.execute;
export default administrativeSignerProxyRoleTool;
