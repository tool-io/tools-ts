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
  return H.finish({
    even: i.bits
      .split("")
      .filter((_, j) => j % 2 === 0)
      .join(""),
    odd: i.bits
      .split("")
      .filter((_, j) => j % 2 === 1)
      .join(""),
  });
};
export const example = {
  input: { bits: "11001" },
  output: { result: { even: "101", odd: "10" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-even-odd-lane-split",
  title: "Bit String Even Odd Lane Split",
  description:
    "Split an explicit bit string into even and odd zero-based lanes, preserving a possible extra final even-lane bit.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
