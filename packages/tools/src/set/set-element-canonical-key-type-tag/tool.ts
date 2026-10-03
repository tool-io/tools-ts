import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly valueJson: string };
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valueJson: { type: "string", maxLength: 8192 } },
  required: ["valueJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Compute set element canonical key type tag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { valueJson } = input;
  const compute = (): Output => {
    const value = parseJson(valueJson);
    domain(
      value === null || ["string", "number", "boolean"].includes(typeof value),
    );
    return {
      key:
        (value === null ? "null" : typeof value) + ":" + JSON.stringify(value),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { valueJson: '"12"' },
  output: { key: 'string:"12"' },
} satisfies ToolExample<Input, Output>;
export const setElementCanonicalKeyTypeTagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/set-element-canonical-key-type-tag",
  title: "Set Element Canonical Key Type Tag Tool",
  description:
    "Compute set element canonical key type tag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "valueJson",
        label: "Value Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
  },
});
export const run = setElementCanonicalKeyTypeTagTool.execute;
export default setElementCanonicalKeyTypeTagTool;
