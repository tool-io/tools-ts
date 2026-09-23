import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  lowBit: number;
  highBit: number;
  wordWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lowBit", label: "Low bit", kind: "integer" },
  { id: "highBit", label: "High bit", kind: "integer" },
  { id: "wordWidth", label: "Word width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.wordWidth, 1, 128);
  H.int(i.lowBit, 0, i.wordWidth - 1);
  H.int(i.highBit, i.lowBit, i.wordWidth - 1);
  return H.finish({ width: i.highBit - i.lowBit + 1 });
};
export const example = {
  input: { lowBit: 2, highBit: 5, wordWidth: 8 },
  output: { result: { width: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/bitfield-width-from-endpoints",
  title: "Bitwise: Bitfield Width From Endpoints Tool",
  description:
    "Resolve an inclusive zero-based bitfield width inside an explicit word, rejecting inverted or out-of-word endpoints.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { width: { type: "number" } },
        required: ["width"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
