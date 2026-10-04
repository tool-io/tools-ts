import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string; readonly length: number };
export type Output = { readonly matches: boolean; readonly missing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    length: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["value", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" }, missing: { type: "integer" } },
  required: ["matches", "missing"],
} as const;
/** Compute gs1 ai fixed length padding check from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, length } = input;
  const compute = (): Output => {
    integer(length, 1, 128);
    domain(/^\d*(?![\s\S])/.test(value));
    return {
      matches: value.length === length,
      missing: Math.max(0, length - value.length),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "123", length: 5 },
  output: { matches: false, missing: 2 },
} satisfies ToolExample<Input, Output>;
export const gs1AiFixedLengthPaddingCheckTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/gs1-ai-fixed-length-padding-check",
  title: "GS1 AI Fixed Length Padding Check Tool",
  description:
    "Compute gs1 ai fixed length padding check from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "length",
        label: "Length",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      { id: "missing", label: "Missing", valueType: { type: "integer" } },
    ],
  },
});
export const run = gs1AiFixedLengthPaddingCheckTool.execute;
export default gs1AiFixedLengthPaddingCheckTool;
