import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly text: string; readonly cursor: number };
export type Output = {
  readonly splitsCrLf: boolean;
  readonly previousSafe: number;
  readonly nextSafe: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    cursor: { type: "integer", minimum: 0 },
  },
  required: ["text", "cursor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    splitsCrLf: { type: "boolean" },
    previousSafe: { type: "integer" },
    nextSafe: { type: "integer" },
  },
  required: ["splitsCrLf", "previousSafe", "nextSafe"],
} as const;
/** Compute text crlf split cursor guard from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { text, cursor } = input;
  const compute = (): Output => {
    integer(cursor, 0, text.length);
    const splitsCrLf =
      cursor > 0 &&
      cursor < text.length &&
      text[cursor - 1] === "\r" &&
      text[cursor] === "\n";
    return {
      splitsCrLf,
      previousSafe: splitsCrLf ? cursor - 1 : cursor,
      nextSafe: splitsCrLf ? cursor + 1 : cursor,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "a\r\nb", cursor: 2 },
  output: { splitsCrLf: true, previousSafe: 1, nextSafe: 3 },
} satisfies ToolExample<Input, Output>;
export const textCrlfSplitCursorGuardTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/text-crlf-split-cursor-guard",
  title: "Text CRLF Split Cursor Guard Tool",
  description:
    "Compute text crlf split cursor guard from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "text",
        label: "Text",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "cursor",
        label: "Cursor",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "splitsCrLf",
        label: "Splits Cr Lf",
        valueType: { type: "boolean" },
      },
      {
        id: "previousSafe",
        label: "Previous Safe",
        valueType: { type: "integer" },
      },
      { id: "nextSafe", label: "Next Safe", valueType: { type: "integer" } },
    ],
  },
});
export const run = textCrlfSplitCursorGuardTool.execute;
export default textCrlfSplitCursorGuardTool;
