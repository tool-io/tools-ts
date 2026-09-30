import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly requiredNames: readonly string[];
  readonly allowEmpty: boolean;
};
export type Output = {
  readonly empty: boolean;
  readonly listedRequired: boolean;
  readonly permittedByPolicy: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    requiredNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowEmpty: { type: "boolean" },
  },
  required: ["name", "requiredNames", "allowEmpty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    empty: { type: "boolean" },
    listedRequired: { type: "boolean" },
    permittedByPolicy: { type: "boolean" },
  },
  required: ["empty", "listedRequired", "permittedByPolicy"],
} as const;
/** Keep valid empty JSON property names distinct from a caller-imposed nonempty-name policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, requiredNames, allowEmpty } = request;
  const compute = (): Output => {
    return {
      empty: name.length === 0,
      listedRequired: requiredNames.includes(name),
      permittedByPolicy: allowEmpty || name.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "", requiredNames: [""], allowEmpty: true },
  output: { empty: true, listedRequired: true, permittedByPolicy: true },
} satisfies ToolExample<Input, Output>;
export const jsonSchemaPropertyNameEmptyFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-schema-property-name-empty-flag",
    title: "JSON Schema Property Name Empty Flag Tool",
    description:
      "Keep valid empty JSON property names distinct from a caller-imposed nonempty-name policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        requiredNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        allowEmpty: { type: "boolean" },
      },
      required: ["name", "requiredNames", "allowEmpty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        empty: { type: "boolean" },
        listedRequired: { type: "boolean" },
        permittedByPolicy: { type: "boolean" },
      },
      required: ["empty", "listedRequired", "permittedByPolicy"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredNames",
          label: "Required Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "allowEmpty",
          label: "Allow Empty",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
        {
          id: "listedRequired",
          label: "Listed Required",
          valueType: { type: "boolean" },
        },
        {
          id: "permittedByPolicy",
          label: "Permitted By Policy",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonSchemaPropertyNameEmptyFlagTool.execute;
export default jsonSchemaPropertyNameEmptyFlagTool;
