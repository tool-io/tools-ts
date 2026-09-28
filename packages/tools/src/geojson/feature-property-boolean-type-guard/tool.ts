import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly propertiesJson: string; readonly key: string };
export type Output = {
  readonly present: boolean;
  readonly boolean: boolean;
  readonly value: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propertiesJson: { type: "string", maxLength: 8192 },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["propertiesJson", "key"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "boolean" },
    boolean: { type: "boolean" },
    value: { type: "boolean" },
  },
  required: ["present", "boolean", "value"],
} as const;
/** Calculate feature property boolean type guard from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { propertiesJson, key } = input;
  const compute = (): Output => {
    const p = H.plain(H.parseJson(propertiesJson)),
      present = Object.hasOwn(p, key),
      boolean = present && typeof p[key] === "boolean";
    return { present, boolean, value: boolean ? p[key] === true : false };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { propertiesJson: '{"open":false}', key: "open" },
  output: { present: true, boolean: true, value: false },
} satisfies ToolExample<Input, Output>;
export const featurePropertyBooleanTypeGuardTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-property-boolean-type-guard",
    title: "Feature Property Boolean Type Guard Tool",
    description:
      "Calculate feature property boolean type guard from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        propertiesJson: { type: "string", maxLength: 8192 },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["propertiesJson", "key"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        present: { type: "boolean" },
        boolean: { type: "boolean" },
        value: { type: "boolean" },
      },
      required: ["present", "boolean", "value"],
    },
    ports: {
      inputs: [
        {
          id: "propertiesJson",
          label: "Properties Json",
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
        { id: "boolean", label: "Boolean", valueType: { type: "boolean" } },
        { id: "value", label: "Value", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featurePropertyBooleanTypeGuardTool.execute;
export default featurePropertyBooleanTypeGuardTool;
