import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ runsJson: string; value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  const at = r.findIndex((v) => v.value === i.value);
  return H.finish({
    offset: at < 0 ? null : String(H.runOffsets(r)[at]),
    runIndex: at < 0 ? null : at,
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    value: "b",
  },
  output: { result: { offset: "5", runIndex: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "runs/length-record-value-first-offset",
  title: "Run Length Record Value First Offset",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; find the first logical offset of a literal value, retaining null when absent rather than using a sentinel position.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
