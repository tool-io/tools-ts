import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: boolean };
export type Output = { readonly schemaJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "boolean" } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { schemaJson: { type: "string", maxLength: 8192 } },
  required: ["schemaJson"],
} as const;
/** Compute json schema boolean const literal from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    return { schemaJson: JSON.stringify({ type: "boolean", const: value }) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: true },
  output: { schemaJson: '{"type":"boolean","const":true}' },
} satisfies ToolExample<Input, Output>;
export const jsonSchemaBooleanConstLiteralTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-schema-boolean-const-literal",
  title: "JSON Schema Boolean Const Literal Tool",
  description:
    "Compute json schema boolean const literal from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "schemaJson", label: "Schema Json", valueType: { type: "string" } },
    ],
  },
});
export const run = jsonSchemaBooleanConstLiteralTool.execute;
export default jsonSchemaBooleanConstLiteralTool;
