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
  const x = H.word(i.word, i.width);
  return H.finish({ toggled: String(x ^ (2n ** BigInt(i.width - 1))) });
};
export const example = {
  input: { word: "1", width: 8 },
  output: { result: { toggled: "129" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/bit-word-sign-bit-toggle",
  title: "Bitwise: Bit Word Sign Bit Toggle Tool",
  description:
    "Toggle only the most-significant bit of an arbitrary declared-width word; this is not floating-point sign handling.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { toggled: { type: "string" } },
        required: ["toggled"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
