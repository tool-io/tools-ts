import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  runsJson: string;
  start: string;
  end: string;
  value: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "start", label: "start", kind: "string" },
  { id: "end", label: "end", kind: "string" },
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  return H.finish({
    count: String(
      H.runSlice(r, H.bigint(i.start), H.bigint(i.end))
        .filter((v) => v.value === i.value)
        .reduce((s, v) => s + v.length, 0n),
    ),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    start: "2",
    end: "7",
    value: "a",
  },
  output: { result: { count: "3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "runs/length-record-value-window-count",
  title: "Run Length Record Value Window Count",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; count exact logical occurrences of one literal value in an explicit half-open window without expanding.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
