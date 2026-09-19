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
    b = H.lengthRuns(i.rightJson);
  return H.finish({ runs: H.runJson(H.runCompact([...a, ...b])) });
};
export const example = {
  input: {
    leftJson: '[{"value": "a", "length": "3"}]',
    rightJson: '[{"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
  },
  output: {
    result: {
      runs: [
        { value: "a", length: "5" },
        { value: "b", length: "4" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "runs/length-record-concatenation",
  title: "Run Length Record Concatenation",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; concatenate two encoded sequences and canonicalize all adjacent equal runs across the join.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
