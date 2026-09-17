import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ digits: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "digits", kind: "numberList", label: "digits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ permutation: H.unLehmer(i.digits) });
};
export const example = {
  input: { digits: [2, 0, 0] },
  output: { result: { permutation: [2, 0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/lehmer-code-permutation",
  title: "Lehmer Code Permutation Decoder",
  description:
    "Decode a bounded Lehmer code by selecting each digit from the remaining sorted index universe; invalid digit ranges are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
