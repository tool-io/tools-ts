import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ pairsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pairsJson", kind: "string", label: "pairsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const pairs = H.arr(i.pairsJson).map((v) => {
    H.check(Array.isArray(v) && v.length === 2);
    const r = v as unknown[];
    return [H.str(r[0]), H.str(r[1])];
  });
  return H.finish({ duplicates: H.duplicates(pairs, (r) => r[0]) });
};
export const example = {
  input: { pairsJson: '[["a","1"],["b","2"],["a","3"]]' },
  output: { result: { duplicates: [{ key: "a", indexes: [0, 2] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/key-value-block-duplicate-audit",
  title: "Key Value Block Duplicate Audit",
  description:
    "Audit duplicate literal keys in an ordered key-value block without choosing first or last wins.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
