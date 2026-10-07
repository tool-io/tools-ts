import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseId: string;
  readonly proxyId: string;
  readonly sourceRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseId: { type: "string", maxLength: 8192, minLength: 1 },
    proxyId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["responseId", "proxyId", "sourceRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly supplied child-study proxy response source without inferring authority or response accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseId, proxyId, sourceRole } = request;
  const compute = (): Output => {
    H.domain(responseId.length > 0, "responseId");
    H.domain(proxyId.length > 0, "proxyId");
    H.domain(sourceRole.length > 0, "sourceRole");
    return { token: JSON.stringify([responseId, proxyId, sourceRole]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseId: "R17", proxyId: "P4", sourceRole: "parent" },
  output: { token: '["R17","P4","parent"]' },
} satisfies ToolExample<Input, Output>;
export const parentProxyResponseSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/parent-proxy-response-source-tag",
    title: "Parent Proxy Response Source Tag",
    description:
      "Record an explicitly supplied child-study proxy response source without inferring authority or response accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseId: { type: "string", maxLength: 8192, minLength: 1 },
        proxyId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["responseId", "proxyId", "sourceRole"],
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
          id: "responseId",
          label: "Response Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "proxyId",
          label: "Proxy Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceRole",
          label: "Source Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = parentProxyResponseSourceTagTool.execute;
export default parentProxyResponseSourceTagTool;
