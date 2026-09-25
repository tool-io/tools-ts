import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Compute ascii control caret token value from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(/^\^[\x40-\x5f?](?![\s\S])/.test(token));
    return { octet: token[1] === "?" ? 127 : token.charCodeAt(1) - 64 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "^M" },
  output: { octet: 13 },
} satisfies ToolExample<Input, Output>;
export const asciiControlCaretTokenValueTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/ascii-control-caret-token-value",
  title: "Ascii Control Caret Token Value Tool",
  description:
    "Compute ascii control caret token value from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "octet", label: "Octet", valueType: { type: "integer" } }],
  },
});
export const run = asciiControlCaretTokenValueTool.execute;
export default asciiControlCaretTokenValueTool;
