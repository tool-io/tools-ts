import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly objectJson: string; readonly key: string };
export type Output = { readonly present: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectJson: { type: "string", maxLength: 8192 },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["objectJson", "key"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { present: { type: "boolean" } },
  required: ["present"],
} as const;
/** Calculate json schema required single key check from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { objectJson, key } = input;
  const compute = (): Output => {
    const object = H.plain(H.parseJson(objectJson));
    return { present: Object.hasOwn(object, key) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { objectJson: '{"x":null}', key: "x" },
  output: { present: true },
} satisfies ToolExample<Input, Output>;
export const jsonSchemaRequiredSingleKeyCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-schema-required-single-key-check",
    title: "JSON Schema Required Single Key Check Tool",
    description:
      "Calculate json schema required single key check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectJson: { type: "string", maxLength: 8192 },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["objectJson", "key"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { present: { type: "boolean" } },
      required: ["present"],
    },
    ports: {
      inputs: [
        {
          id: "objectJson",
          label: "Object Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "key",
          label: "Key",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "present", label: "Present", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = jsonSchemaRequiredSingleKeyCheckTool.execute;
export default jsonSchemaRequiredSingleKeyCheckTool;
