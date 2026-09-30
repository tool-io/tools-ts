import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  parseJson,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly key: string; readonly valueJson: string };
export type Output = { readonly json: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    valueJson: { type: "string", maxLength: 8192 },
  },
  required: ["key", "valueJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { json: { type: "string", maxLength: 8192 } },
  required: ["json"],
} as const;
/** Compute json object single member wrapper from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { key, valueJson } = input;
  const compute = (): Output => {
    const value = parseJson(valueJson);
    return { json: JSON.stringify({ [key]: value }) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { key: "a", valueJson: "[1,2]" },
  output: { json: '{"a":[1,2]}' },
} satisfies ToolExample<Input, Output>;
export const jsonObjectSingleMemberWrapperTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-object-single-member-wrapper",
  title: "JSON Object Single Member Wrapper Tool",
  description:
    "Compute json object single member wrapper from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "key",
        label: "Key",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "valueJson",
        label: "Value Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "json", label: "Json", valueType: { type: "string" } }],
  },
});
export const run = jsonObjectSingleMemberWrapperTool.execute;
export default jsonObjectSingleMemberWrapperTool;
