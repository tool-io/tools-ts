import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.decimal(i.left),
    b = H.decimal(i.right),
    s = Math.max(a.scale, b.scale),
    x = a.n * H.pow10(s - a.scale),
    y = b.n * H.pow10(s - b.scale);
  return H.finish({ order: x < y ? -1 : x > y ? 1 : 0 });
};
export const example = {
  input: { left: "9007199254740993", right: "9007199254740992" },
  output: { result: { order: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-spelling-exact-comparison",
  title: "Decimal Spelling Exact Comparison",
  description:
    "Compare finite decimal spellings exactly using BigInt scale alignment, not IEEE-754 conversion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
