import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sourceId: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sourceId: { type: "string", maxLength: 8192 } },
  required: ["sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format an explicit source identifier using the local [cite:ID] annotation convention without verifying a citation or claiming a platform-specific syntax. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId } = request;
  const compute = (): Output => {
    H.domain(/^[A-Za-z0-9_-]{1,128}(?![\s\S])/.test(sourceId), "sourceId");
    return { token: "[cite:" + sourceId + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "source_17" },
  output: { token: "[cite:source_17]" },
} satisfies ToolExample<Input, Output>;
export const aiOutputCitationIdTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/ai-output-citation-id-token",
    title: "AI Output Citation ID Token",
    description:
      "Format an explicit source identifier using the local [cite:ID] annotation convention without verifying a citation or claiming a platform-specific syntax.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sourceId: { type: "string", maxLength: 8192 } },
      required: ["sourceId"],
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
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = aiOutputCitationIdTokenTool.execute;
export default aiOutputCitationIdTokenTool;
