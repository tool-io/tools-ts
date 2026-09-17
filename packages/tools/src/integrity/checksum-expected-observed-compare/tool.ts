import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ expected: string; observed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "expected", kind: "string", label: "expected" },
  { id: "observed", kind: "string", label: "observed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const expected = H.bigint(i.expected),
    observed = H.bigint(i.observed);
  H.check(expected >= 0n && observed >= 0n);
  return H.finish({
    matches: expected === observed,
    difference: String(observed - expected),
  });
};
export const example = {
  input: { expected: "10", observed: "9" },
  output: { result: { matches: false, difference: "-1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/checksum-expected-observed-compare",
  title: "Checksum Expected Observed Compare",
  description:
    "Compare exact unsigned expected and observed checksum integers, retaining signed discrepancy; equality does not prove authenticity or collision freedom.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
