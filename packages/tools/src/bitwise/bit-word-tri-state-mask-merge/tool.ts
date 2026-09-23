import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  base: string;
  replacement: string;
  knownMask: string;
  width: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "base", label: "Base", kind: "string" },
  { id: "replacement", label: "Replacement", kind: "string" },
  { id: "knownMask", label: "Known mask", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.word(i.base, i.width),
    b = H.word(i.replacement, i.width),
    mask = H.word(i.knownMask, i.width),
    all = 2n ** BigInt(i.width) - 1n;
  return H.finish({ merged: String((a & (~mask & all)) | (b & mask)) });
};
export const example = {
  input: { base: "170", replacement: "85", knownMask: "15", width: 8 },
  output: { result: { merged: "165" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/bit-word-tri-state-mask-merge",
  title: "Bitwise: Bit Word Tri State Mask Merge Tool",
  description:
    "Merge replacement bits only where an explicit known/write mask is set, preserving unknown positions from the base word.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { merged: { type: "string" } },
        required: ["merged"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
