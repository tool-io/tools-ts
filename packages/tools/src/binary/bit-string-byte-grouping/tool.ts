import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  H.check(i.bits.length % 8 === 0);
  return H.finish({
    groups: i.bits.match(/.{8}/g) ?? [],
    bytes: Array.from({ length: i.bits.length / 8 }, (_, j) =>
      parseInt(i.bits.slice(j * 8, j * 8 + 8), 2),
    ),
  });
};
export const example = {
  input: { bits: "0000000111111111" },
  output: { result: { groups: ["00000001", "11111111"], bytes: [1, 255] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/bit-string-byte-grouping",
  title: "Bit String Byte Grouping",
  description:
    "Group a complete MSB-first binary string into eight-bit bytes; partial final bytes are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
