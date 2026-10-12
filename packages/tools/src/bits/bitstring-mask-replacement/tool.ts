import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bits: string;
  mask: string;
  replacement: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "mask", kind: "string", label: "mask" },
  { id: "replacement", kind: "string", label: "replacement" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  [i.bits, i.mask, i.replacement].forEach(H.bits);
  H.check(
    i.bits.length === i.mask.length && i.bits.length === i.replacement.length,
  );
  return H.finish({
    bits: i.bits
      .split("")
      .map((x, j) => (i.mask[j] === "1" ? i.replacement[j] : x))
      .join(""),
  });
};
export const example = {
  input: { bits: "0000", mask: "1010", replacement: "1111" },
  output: { result: { bits: "1010" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-mask-replacement",
  title: "Bit String Mask Replacement",
  description:
    "Replace bit positions only where an equal-width explicit mask has one; preserve all unmasked source positions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { bits: { type: "string" } },
        required: ["bits"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
