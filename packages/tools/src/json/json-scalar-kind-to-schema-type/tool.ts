import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly valueJson: string };
export type Output = { readonly type: string; readonly scalar: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valueJson: { type: "string", maxLength: 8192 } },
  required: ["valueJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type: "string", maxLength: 8192 },
    scalar: { type: "boolean" },
  },
  required: ["type", "scalar"],
} as const;
/** Calculate json scalar kind to schema type from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { valueJson } = input;
  const compute = (): Output => {
    const value = H.parseJson(valueJson);
    return {
      type:
        value === null
          ? "null"
          : Array.isArray(value)
            ? "array"
            : typeof value === "number" && Number.isInteger(value)
              ? "integer"
              : typeof value,
      scalar: value === null || typeof value !== "object",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { valueJson: "12" },
  output: { type: "integer", scalar: true },
} satisfies ToolExample<Input, Output>;
export const jsonScalarKindToSchemaTypeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-scalar-kind-to-schema-type",
    title: "JSON Scalar Kind To Schema Type Tool",
    description:
      "Calculate json scalar kind to schema type from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { valueJson: { type: "string", maxLength: 8192 } },
      required: ["valueJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { type: "string", maxLength: 8192 },
        scalar: { type: "boolean" },
      },
      required: ["type", "scalar"],
    },
    ports: {
      inputs: [
        {
          id: "valueJson",
          label: "Value Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "type", label: "Type", valueType: { type: "string" } },
        { id: "scalar", label: "Scalar", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = jsonScalarKindToSchemaTypeTool.execute;
export default jsonScalarKindToSchemaTypeTool;
