import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly decoded: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { decoded: { type: "string", maxLength: 8192 } },
  required: ["decoded"],
} as const;
/** Compute rfc 2047 q underscore space token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(token === "_");
    return { decoded: " " };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "_" },
  output: { decoded: " " },
} satisfies ToolExample<Input, Output>;
export const rfc2047QUnderscoreSpaceTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/rfc2047-q-underscore-space-token",
  title: "RFC 2047 Q Underscore Space Token Tool",
  description:
    "Compute rfc 2047 q underscore space token from explicit bounded inputs.",
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
    outputs: [
      { id: "decoded", label: "Decoded", valueType: { type: "string" } },
    ],
  },
});
export const run = rfc2047QUnderscoreSpaceTokenTool.execute;
export default rfc2047QUnderscoreSpaceTokenTool;
