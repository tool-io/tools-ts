import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  permutation: readonly number[];
  includeFixed: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "permutation", kind: "numberList", label: "permutation" },
  { id: "includeFixed", kind: "boolean", label: "includeFixed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const c = H.cycles(i.permutation);
  return H.finish({
    notation: c
      .filter((r) => i.includeFixed || r.length > 1)
      .map((r) => "(" + r.join(" ") + ")")
      .join(""),
  });
};
export const example = {
  input: { permutation: [1, 0, 2], includeFixed: true },
  output: { result: { notation: "(0 1)(2)" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/permutation-cycle-notation-formatter",
  title: "Permutation Cycle Notation Formatter",
  description:
    "Format canonical zero-based disjoint permutation cycles with an explicit fixed-point display policy; no one-based convention implied.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
