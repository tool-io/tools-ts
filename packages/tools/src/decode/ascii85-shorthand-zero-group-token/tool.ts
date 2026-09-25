import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly bytes: readonly number[] };
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
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["bytes"],
} as const;
/** Compute ascii85 shorthand zero group token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(token === "z");
    return { bytes: [0, 0, 0, 0] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "z" },
  output: { bytes: [0, 0, 0, 0] },
} satisfies ToolExample<Input, Output>;
export const ascii85ShorthandZeroGroupTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/ascii85-shorthand-zero-group-token",
  title: "Ascii85 Shorthand Zero Group Token Tool",
  description:
    "Compute ascii85 shorthand zero group token from explicit bounded inputs.",
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
      {
        id: "bytes",
        label: "Bytes",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = ascii85ShorthandZeroGroupTokenTool.execute;
export default ascii85ShorthandZeroGroupTokenTool;
