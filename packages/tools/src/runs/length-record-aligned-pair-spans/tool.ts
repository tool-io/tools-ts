import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ leftJson: string; rightJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftJson", label: "leftJson", kind: "string" },
  { id: "rightJson", label: "rightJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.lengthRuns(i.leftJson),
    b = H.lengthRuns(i.rightJson),
    pairs = H.runPairs(a, b);
  return H.finish({ spans: pairs });
};
export const example = {
  input: {
    leftJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    rightJson: '[{"value":"a","length":"4"},{"value":"c","length":"5"}]',
  },
  output: {
    result: {
      spans: [
        { start: "0", end: "3", left: "a", right: "a" },
        { start: "3", end: "4", left: "a", right: "a" },
        { start: "4", end: "5", left: "a", right: "c" },
        { start: "5", end: "9", left: "b", right: "c" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "runs/length-record-aligned-pair-spans",
  title: "Run Length Record Aligned Pair Spans",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; align two equal-total encoded sequences at every source boundary, with paired values and exact logical spans.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
