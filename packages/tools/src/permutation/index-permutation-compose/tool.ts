import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  first: readonly number[];
  second: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "first", kind: "numberList", label: "first" },
  { id: "second", kind: "numberList", label: "second" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.permutation(i.first);
  H.permutation(i.second);
  H.check(i.first.length === i.second.length);
  return H.finish({ permutation: i.first.map((x) => i.second[x]) });
};
export const example = {
  input: { first: [2, 0, 1], second: [1, 0, 2] },
  output: { result: { permutation: [2, 1, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/index-permutation-compose",
  title: "Index Permutation Composition",
  description:
    "Compose index permutations by applying first then second to each index; composition convention is explicit and operand lengths must agree.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
