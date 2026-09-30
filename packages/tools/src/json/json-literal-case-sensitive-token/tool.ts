import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly valid: boolean; readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
  },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    kind: { type: "string", maxLength: 8192 },
  },
  required: ["valid", "kind"],
} as const;
/** Calculate json literal case sensitive token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const valid = ["null", "true", "false"].includes(token);
    return {
      valid,
      kind: valid ? (token === "null" ? "null" : "boolean") : "invalid",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "TRUE" },
  output: { valid: false, kind: "invalid" },
} satisfies ToolExample<Input, Output>;
export const jsonLiteralCaseSensitiveTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-literal-case-sensitive-token",
    title: "JSON Literal Case Sensitive Token Tool",
    description:
      "Calculate json literal case sensitive token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: {
          type: "string",
          maxLength: 8192,
        },
      },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        kind: { type: "string", maxLength: 8192 },
      },
      required: ["valid", "kind"],
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
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        { id: "kind", label: "Kind", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = jsonLiteralCaseSensitiveTokenTool.execute;
export default jsonLiteralCaseSensitiveTokenTool;
