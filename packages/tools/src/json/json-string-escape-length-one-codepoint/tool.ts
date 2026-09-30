import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  codePoint,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly point: number; readonly asciiOnly: boolean };
export type Output = { readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { point: { type: "integer" }, asciiOnly: { type: "boolean" } },
  required: ["point", "asciiOnly"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer" } },
  required: ["length"],
} as const;
/** Compute json string escape length one codepoint from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point, asciiOnly } = input;
  const compute = (): Output => {
    codePoint(point);
    const s = String.fromCodePoint(point);
    return {
      length:
        asciiOnly && point > 127
          ? point > 65535
            ? 12
            : 6
          : JSON.stringify(s).length - 2,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: 128512, asciiOnly: true },
  output: { length: 12 },
} satisfies ToolExample<Input, Output>;
export const jsonStringEscapeLengthOneCodepointTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-string-escape-length-one-codepoint",
  title: "JSON String Escape Length One Codepoint Tool",
  description:
    "Compute json string escape length one codepoint from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "point",
        label: "Point",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "asciiOnly",
        label: "Ascii Only",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "length", label: "Length", valueType: { type: "integer" } },
    ],
  },
});
export const run = jsonStringEscapeLengthOneCodepointTool.execute;
export default jsonStringEscapeLengthOneCodepointTool;
