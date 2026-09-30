import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly property: string };
export type Output = { readonly pointer: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { property: { type: "string", maxLength: 8192 } },
  required: ["property"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pointer: { type: "string", maxLength: 8192 } },
  required: ["pointer"],
} as const;
/** Compute json schema property name literal path from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { property } = input;
  const compute = (): Output => {
    return {
      pointer:
        "/properties/" + property.replaceAll("~", "~0").replaceAll("/", "~1"),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { property: "a/b" },
  output: { pointer: "/properties/a~1b" },
} satisfies ToolExample<Input, Output>;
export const jsonSchemaPropertyNameLiteralPathTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-schema-property-name-literal-path",
  title: "JSON Schema Property Name Literal Path Tool",
  description:
    "Compute json schema property name literal path from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "property",
        label: "Property",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "pointer", label: "Pointer", valueType: { type: "string" } },
    ],
  },
});
export const run = jsonSchemaPropertyNameLiteralPathTool.execute;
export default jsonSchemaPropertyNameLiteralPathTool;
