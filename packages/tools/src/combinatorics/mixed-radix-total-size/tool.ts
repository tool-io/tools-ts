import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ radices: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "radices", kind: "numberList", label: "radices" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ size: String(H.radix(i.radices)) });
};
export const example = {
  input: { radices: [2, 3, 4] },
  output: { result: { size: "24" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/mixed-radix-total-size",
  title: "Mixed Radix Total Size",
  description:
    "Return exact mixed-radix product size as decimal integer text; an empty digit tuple has one possible state.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
