import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly method: string };
export type Output = { readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { method: { type: "string", maxLength: 8192 } },
  required: ["method"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" } },
  required: ["valid"],
} as const;
/** Compute http allow header single method token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { method } = input;
  const compute = (): Output => {
    return { valid: /^[!#$%&\x27*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(method) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { method: "PATCH" },
  output: { valid: true },
} satisfies ToolExample<Input, Output>;
export const httpAllowHeaderSingleMethodTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/http-allow-header-single-method-token",
  title: "HTTP Allow Header Single Method Token Tool",
  description:
    "Compute http allow header single method token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "method",
        label: "Method",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "valid", label: "Valid", valueType: { type: "boolean" } }],
  },
});
export const run = httpAllowHeaderSingleMethodTokenTool.execute;
export default httpAllowHeaderSingleMethodTokenTool;
