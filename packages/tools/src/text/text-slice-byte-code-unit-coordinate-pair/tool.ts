import { utf8Encode } from "../../core/encoding.js";
import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly text: string; readonly codeUnitOffset: number };
export type Output = {
  readonly utf8ByteOffset: number;
  readonly splitsSurrogate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    codeUnitOffset: { type: "integer", minimum: 0 },
  },
  required: ["text", "codeUnitOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utf8ByteOffset: { type: "integer" },
    splitsSurrogate: { type: "boolean" },
  },
  required: ["utf8ByteOffset", "splitsSurrogate"],
} as const;
/** Compute text slice byte code unit coordinate pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { text, codeUnitOffset } = input;
  const compute = (): Output => {
    integer(codeUnitOffset, 0, text.length);
    const a = text.charCodeAt(codeUnitOffset - 1),
      b = text.charCodeAt(codeUnitOffset),
      splitsSurrogate =
        a >= 0xd800 && a <= 0xdbff && b >= 0xdc00 && b <= 0xdfff;
    return {
      utf8ByteOffset: utf8Encode(text.slice(0, codeUnitOffset)).length,
      splitsSurrogate,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "a😀b", codeUnitOffset: 3 },
  output: { utf8ByteOffset: 5, splitsSurrogate: false },
} satisfies ToolExample<Input, Output>;
export const textSliceByteCodeUnitCoordinatePairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/text-slice-byte-code-unit-coordinate-pair",
  title: "Text Slice Byte Code Unit Coordinate Pair Tool",
  description:
    "Compute text slice byte code unit coordinate pair from explicit bounded inputs.",
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
        id: "codeUnitOffset",
        label: "Code Unit Offset",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "utf8ByteOffset",
        label: "Utf8Byte Offset",
        valueType: { type: "integer" },
      },
      {
        id: "splitsSurrogate",
        label: "Splits Surrogate",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = textSliceByteCodeUnitCoordinatePairTool.execute;
export default textSliceByteCodeUnitCoordinatePairTool;
