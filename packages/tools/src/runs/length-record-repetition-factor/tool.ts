import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ runsJson: string; factor: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "factor", label: "factor", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  H.int(i.factor, 0, 128);
  H.check(r.length * i.factor <= 128);
  return H.finish({
    runs: H.runJson(
      H.runCompact(Array.from({ length: i.factor }, () => r).flat()),
    ),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    factor: 2,
  },
  output: {
    result: {
      runs: [
        { value: "a", length: "5" },
        { value: "b", length: "4" },
        { value: "a", length: "5" },
        { value: "b", length: "4" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "runs/length-record-repetition-factor",
  title: "Run Length Record Repetition Factor",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; repeat an encoded sequence a bounded nonnegative number of times and canonicalize boundaries; output record count remains bounded to 128.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
