import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ word: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", label: "Word", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.word, i.width),
    digits = Math.ceil(i.width / 4);
  return H.finish({
    hexadecimal: x.toString(16).toUpperCase().padStart(digits, "0"),
    hexDigits: digits,
    paddingBits: 4 * digits - i.width,
  });
};
export const example = {
  input: { word: "17", width: 5 },
  output: { result: { hexadecimal: "11", hexDigits: 2, paddingBits: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/bit-word-hex-digit-boundary-padding",
  title: "Bitwise: Bit Word Hex Digit Boundary Padding Tool",
  description:
    "Format a declared-width bit word to complete hexadecimal digits while reporting non-data high padding bits; exact decimal input avoids numeric precision loss.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hexDigits: { type: "number" },
          hexadecimal: { type: "string" },
          paddingBits: { type: "number" },
        },
        required: ["hexDigits", "hexadecimal", "paddingBits"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
