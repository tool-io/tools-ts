import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly approximate: boolean };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    approximate: { type: "boolean" },
  },
  required: ["token", "approximate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate numeric approximation symbol prefix from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, approximate } = request;
  const compute = (): Output => {
    H.domain(token.length > 0);
    return { text: (approximate ? "≈ " : "= ") + token };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "3.14", approximate: true },
  output: { text: "≈ 3.14" },
} satisfies ToolExample<Input, Output>;
export const numericApproximationSymbolPrefixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/numeric-approximation-symbol-prefix",
    title: "Numeric Approximation Symbol Prefix Tool",
    description:
      "Calculate numeric approximation symbol prefix from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        approximate: { type: "boolean" },
      },
      required: ["token", "approximate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approximate",
          label: "Approximate",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = numericApproximationSymbolPrefixTool.execute;
export default numericApproximationSymbolPrefixTool;
