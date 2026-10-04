import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly extend: boolean; readonly scalar: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { extend: { type: "boolean" }, scalar: { type: "integer" } },
  required: ["extend", "scalar"],
} as const;
/** Check one Unicode scalar against the executing runtime Grapheme_Extend binary property. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    H.domain(Array.from(text).length === 1);
    const scalar = text.codePointAt(0);
    H.domain(scalar !== undefined);
    H.codePoint(scalar);
    return { extend: /\p{Grapheme_Extend}/u.test(text), scalar };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "́" },
  output: { extend: true, scalar: 769 },
} satisfies ToolExample<Input, Output>;
export const unicodeGraphemeExtendPropertyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-grapheme-extend-property-token",
    title: "Unicode Grapheme Extend Property Token Tool",
    description:
      "Check one Unicode scalar against the executing runtime Grapheme_Extend binary property.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { extend: { type: "boolean" }, scalar: { type: "integer" } },
      required: ["extend", "scalar"],
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
        { id: "extend", label: "Extend", valueType: { type: "boolean" } },
        { id: "scalar", label: "Scalar", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = unicodeGraphemeExtendPropertyTokenTool.execute;
export default unicodeGraphemeExtendPropertyTokenTool;
