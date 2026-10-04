import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly offset: number;
  readonly crlfSingle: boolean;
};
export type Output = { readonly line: number; readonly column: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    offset: { type: "integer", minimum: 0 },
    crlfSingle: { type: "boolean" },
  },
  required: ["text", "offset", "crlfSingle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "integer" }, column: { type: "integer" } },
  required: ["line", "column"],
} as const;
/** Calculate text line column crlf unit choice from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, offset, crlfSingle } = request;
  const compute = (): Output => {
    H.integer(offset, 0, text.length);
    const prefix = text.slice(0, offset);
    let line = 1,
      column = 0;
    for (let i = 0; i < prefix.length; i++) {
      if (prefix[i] === "\r") {
        line++;
        column = 0;
        if (crlfSingle && prefix[i + 1] === "\n") i++;
      } else if (prefix[i] === "\n") {
        line++;
        column = 0;
      } else column++;
    }
    return { line, column };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "a\r\nb", offset: 4, crlfSingle: true },
  output: { line: 2, column: 1 },
} satisfies ToolExample<Input, Output>;
export const textLineColumnCrlfUnitChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/text-line-column-crlf-unit-choice",
    title: "Text Line Column CRLF Unit Choice Tool",
    description:
      "Calculate text line column crlf unit choice from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        offset: { type: "integer", minimum: 0 },
        crlfSingle: { type: "boolean" },
      },
      required: ["text", "offset", "crlfSingle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { line: { type: "integer" }, column: { type: "integer" } },
      required: ["line", "column"],
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
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "crlfSingle",
          label: "Crlf Single",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "line", label: "Line", valueType: { type: "integer" } },
        { id: "column", label: "Column", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = textLineColumnCrlfUnitChoiceTool.execute;
export default textLineColumnCrlfUnitChoiceTool;
