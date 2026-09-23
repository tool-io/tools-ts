import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ mask: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "Mask", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.mask, i.width),
    singleton = x !== 0n && (x & (x - 1n)) === 0n;
  return H.finish({
    singleton,
    index: singleton ? x.toString(2).length - 1 : -1,
  });
};
export const example = {
  input: { mask: "8", width: 8 },
  output: { result: { singleton: true, index: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/bitmask-singleton-index-check",
  title: "Bitwise: Bitmask Singleton Index Check Tool",
  description:
    "Recognize a one-hot fixed-width mask and return its zero-based set-bit index, using -1 for zero or multiple set bits.",
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
          index: { type: "number" },
          singleton: { type: "boolean" },
        },
        required: ["index", "singleton"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
