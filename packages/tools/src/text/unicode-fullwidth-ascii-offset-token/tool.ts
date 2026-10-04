import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly converted: string; readonly changed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    converted: { type: "string", maxLength: 8192 },
    changed: { type: "integer" },
  },
  required: ["converted", "changed"],
} as const;
/** Map only the Unicode fullwidth ASCII forms FF01..FF5E to ASCII, preserving all other characters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    let changed = 0;
    const converted = Array.from(text, (c) => {
      const n = c.codePointAt(0) ?? 0;
      if (n >= 65281 && n <= 65374) {
        changed++;
        return String.fromCodePoint(n - 65248);
      }
      return c;
    }).join("");
    return { converted, changed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "ＡＢ１２！" },
  output: { converted: "AB12!", changed: 5 },
} satisfies ToolExample<Input, Output>;
export const unicodeFullwidthAsciiOffsetTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-fullwidth-ascii-offset-token",
    title: "Unicode Fullwidth Ascii Offset Token Tool",
    description:
      "Map only the Unicode fullwidth ASCII forms FF01..FF5E to ASCII, preserving all other characters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        converted: { type: "string", maxLength: 8192 },
        changed: { type: "integer" },
      },
      required: ["converted", "changed"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "string" } },
        { id: "changed", label: "Changed", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = unicodeFullwidthAsciiOffsetTokenTool.execute;
export default unicodeFullwidthAsciiOffsetTokenTool;
