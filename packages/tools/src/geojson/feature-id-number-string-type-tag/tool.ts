import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly idJson: string };
export type Output = { readonly type: string; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { idJson: { type: "string", maxLength: 8192 } },
  required: ["idJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type: "string", maxLength: 8192 },
    valid: { type: "boolean" },
  },
  required: ["type", "valid"],
} as const;
/** Calculate feature id number string type tag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { idJson } = request;
  const compute = (): Output => {
    const x = H.parseJson(idJson);
    return {
      type: x === null ? "null" : typeof x,
      valid: typeof x === "number" || typeof x === "string",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { idJson: '"42"' },
  output: { type: "string", valid: true },
} satisfies ToolExample<Input, Output>;
export const featureIdNumberStringTypeTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-id-number-string-type-tag",
    title: "Feature ID Number String Type Tag Tool",
    description:
      "Calculate feature id number string type tag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { idJson: { type: "string", maxLength: 8192 } },
      required: ["idJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { type: "string", maxLength: 8192 },
        valid: { type: "boolean" },
      },
      required: ["type", "valid"],
    },
    ports: {
      inputs: [
        {
          id: "idJson",
          label: "Id Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "type", label: "Type", valueType: { type: "string" } },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featureIdNumberStringTypeTagTool.execute;
export default featureIdNumberStringTypeTagTool;
