import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly character: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { character: { type: "string", maxLength: 8192 } },
  required: ["character"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Compute rfc 2047 q space underscore token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { character } = input;
  const compute = (): Output => {
    domain(character === " ");
    return { token: "_" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { character: " " },
  output: { token: "_" },
} satisfies ToolExample<Input, Output>;
export const rfc2047QSpaceUnderscoreTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/rfc2047-q-space-underscore-token",
  title: "RFC 2047 Q Space Underscore Token Tool",
  description:
    "Compute rfc 2047 q space underscore token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "character",
        label: "Character",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
  },
});
export const run = rfc2047QSpaceUnderscoreTokenTool.execute;
export default rfc2047QSpaceUnderscoreTokenTool;
