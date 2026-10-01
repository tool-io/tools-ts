import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly delimiterOffset: number;
  readonly escapeCharacter: string;
};
export type Output = {
  readonly precedingEscapes: number;
  readonly escaped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    delimiterOffset: { type: "integer", minimum: 0 },
    escapeCharacter: { type: "string", maxLength: 8192 },
  },
  required: ["text", "delimiterOffset", "escapeCharacter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    precedingEscapes: { type: "integer" },
    escaped: { type: "boolean" },
  },
  required: ["precedingEscapes", "escaped"],
} as const;
/** Inspect an explicitly selected UTF-16 delimiter position under a repeated single-character escape parity convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, delimiterOffset, escapeCharacter } = request;
  const compute = (): Output => {
    H.integer(delimiterOffset, 0, text.length - 1);
    H.domain(escapeCharacter.length === 1);
    let precedingEscapes = 0;
    for (
      let i = delimiterOffset - 1;
      i >= 0 && text[i] === escapeCharacter;
      i--
    )
      precedingEscapes++;
    return { precedingEscapes, escaped: precedingEscapes % 2 === 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "a\\,b", delimiterOffset: 2, escapeCharacter: "\\" },
  output: { precedingEscapes: 1, escaped: true },
} satisfies ToolExample<Input, Output>;
export const escapedDelimiterParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/escaped-delimiter-parity",
    title: "Escaped Delimiter Parity Tool",
    description:
      "Inspect an explicitly selected UTF-16 delimiter position under a repeated single-character escape parity convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        delimiterOffset: { type: "integer", minimum: 0 },
        escapeCharacter: { type: "string", maxLength: 8192 },
      },
      required: ["text", "delimiterOffset", "escapeCharacter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        precedingEscapes: { type: "integer" },
        escaped: { type: "boolean" },
      },
      required: ["precedingEscapes", "escaped"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiterOffset",
          label: "Delimiter Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "escapeCharacter",
          label: "Escape Character",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "precedingEscapes",
          label: "Preceding Escapes",
          valueType: { type: "integer" },
        },
        { id: "escaped", label: "Escaped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = escapedDelimiterParityTool.execute;
export default escapedDelimiterParityTool;
