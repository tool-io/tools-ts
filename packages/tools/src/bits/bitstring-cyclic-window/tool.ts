import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; start: number; length: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "start", kind: "integer", label: "start" },
  { id: "length", kind: "integer", label: "length" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bits(i.bits);
  H.int(i.start, -1e9, 1e9);
  H.int(i.length, 0, 128);
  H.check(i.bits.length > 0 || i.length === 0);
  return H.finish({
    bits: Array.from(
      { length: i.length },
      (_, j) => i.bits[H.mod(i.start + j, i.bits.length)],
    ).join(""),
  });
};
export const example = {
  input: { bits: "101", start: -1, length: 5 },
  output: { result: { bits: "11011" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-cyclic-window",
  title: "Bit String Cyclic Window",
  description:
    "Extract a bounded circular bit window from a signed starting position, allowing repeated cycles; empty source permits only an empty window.",
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
