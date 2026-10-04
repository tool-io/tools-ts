import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly normalized: string; readonly decoded: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "string", maxLength: 8192 },
    decoded: { type: "boolean" },
  },
  required: ["normalized", "decoded"],
} as const;
/** Calculate uri unreserved percent normalization from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    H.domain(/^%[0-9a-fA-F]{2}(?![\s\S])/.test(token));
    const char = String.fromCharCode(parseInt(token.slice(1), 16)),
      decoded = /^[A-Za-z0-9._~-](?![\s\S])/.test(char);
    return { normalized: decoded ? char : token.toUpperCase(), decoded };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "%7e" },
  output: { normalized: "~", decoded: true },
} satisfies ToolExample<Input, Output>;
export const uriUnreservedPercentNormalizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/uri-unreserved-percent-normalization",
    title: "URI Unreserved Percent Normalization Tool",
    description:
      "Calculate uri unreserved percent normalization from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalized: { type: "string", maxLength: 8192 },
        decoded: { type: "boolean" },
      },
      required: ["normalized", "decoded"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "string" },
        },
        { id: "decoded", label: "Decoded", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = uriUnreservedPercentNormalizationTool.execute;
export default uriUnreservedPercentNormalizationTool;
