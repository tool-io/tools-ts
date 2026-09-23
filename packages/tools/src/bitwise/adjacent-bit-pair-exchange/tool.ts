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
  H.check(i.width % 2 === 0);
  let out = 0n;
  for (let j = 0; j < i.width; j += 2) {
    out |= ((x >> BigInt(j)) & 1n) << BigInt(j + 1);
    out |= ((x >> BigInt(j + 1)) & 1n) << BigInt(j);
  }
  return H.finish({ exchanged: String(out) });
};
export const example = {
  input: { word: "9", width: 4 },
  output: { result: { exchanged: "6" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/adjacent-bit-pair-exchange",
  title: "Bitwise: Adjacent Bit Pair Exchange Tool",
  description:
    "Exchange adjacent low/high bit pairs across an explicitly even-width word, preserving all bits without JavaScript 32-bit coercion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { exchanged: { type: "string" } },
        required: ["exchanged"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
