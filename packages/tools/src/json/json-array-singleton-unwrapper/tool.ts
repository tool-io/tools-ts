import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
  list,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly json: string };
export type Output = { readonly valueJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { json: { type: "string", maxLength: 8192 } },
  required: ["json"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valueJson: { type: "string", maxLength: 8192 } },
  required: ["valueJson"],
} as const;
/** Compute json array singleton unwrapper from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { json } = input;
  const compute = (): Output => {
    const a = list(parseJson(json));
    domain(a.length === 1);
    return { valueJson: JSON.stringify(a[0]) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { json: '["a"]' },
  output: { valueJson: '"a"' },
} satisfies ToolExample<Input, Output>;
export const jsonArraySingletonUnwrapperTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-array-singleton-unwrapper",
  title: "JSON Array Singleton Unwrapper Tool",
  description:
    "Compute json array singleton unwrapper from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "json",
        label: "Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "valueJson", label: "Value Json", valueType: { type: "string" } },
    ],
  },
});
export const run = jsonArraySingletonUnwrapperTool.execute;
export default jsonArraySingletonUnwrapperTool;
