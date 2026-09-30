import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly jsonString: string };
export type Output = { readonly utf16Units: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { jsonString: { type: "string", maxLength: 8192 } },
  required: ["jsonString"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { utf16Units: { type: "integer" } },
  required: ["utf16Units"],
} as const;
/** Count UTF-16 code units in one decoded JSON string literal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jsonString } = request;
  const compute = (): Output => {
    return { utf16Units: H.text(H.parseJson(jsonString)).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jsonString: '"A🚀"' },
  output: { utf16Units: 3 },
} satisfies ToolExample<Input, Output>;
export const jsonStringUtf16UnitCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-string-utf16-unit-count",
    title: "JSON String Utf16 Unit Count Tool",
    description: "Count UTF-16 code units in one decoded JSON string literal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { jsonString: { type: "string", maxLength: 8192 } },
      required: ["jsonString"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { utf16Units: { type: "integer" } },
      required: ["utf16Units"],
    },
    ports: {
      inputs: [
        {
          id: "jsonString",
          label: "Json String",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "utf16Units",
          label: "Utf16Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonStringUtf16UnitCountTool.execute;
export default jsonStringUtf16UnitCountTool;
