import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly nonceBase64: string };
export type Output = { readonly sourceToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nonceBase64: { type: "string", maxLength: 8192 } },
  required: ["nonceBase64"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sourceToken: { type: "string", maxLength: 8192 } },
  required: ["sourceToken"],
} as const;
/** Wrap a syntactically valid CSP base64-value as a quoted nonce source token. No randomness, entropy guarantee, or policy assembly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nonceBase64 } = request;
  const compute = (): Output => {
    H.domain(
      /^[A-Za-z0-9+/_-]+={0,2}(?![\s\S])/.test(nonceBase64),
      "nonceBase64",
    );
    return { sourceToken: "'nonce-" + nonceBase64 + "'" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nonceBase64: "YWJjZA==" },
  output: { sourceToken: "'nonce-YWJjZA=='" },
} satisfies ToolExample<Input, Output>;
export const cspNonceSourceTokenTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "web/csp-nonce-source-token",
      title: "Csp Nonce Source Token Tool",
      description:
        "Wrap a syntactically valid CSP base64-value as a quoted nonce source token. No randomness, entropy guarantee, or policy assembly.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { nonceBase64: { type: "string", maxLength: 8192 } },
        required: ["nonceBase64"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { sourceToken: { type: "string", maxLength: 8192 } },
        required: ["sourceToken"],
      },
      ports: {
        inputs: [
          {
            id: "nonceBase64",
            label: "Nonce Base64",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "sourceToken",
            label: "Source Token",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = cspNonceSourceTokenTool.execute;
export default cspNonceSourceTokenTool;
