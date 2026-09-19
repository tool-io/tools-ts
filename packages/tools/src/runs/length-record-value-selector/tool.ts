import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ runsJson: string; values: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "values", label: "values", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  return H.finish({
    runs: H.runJson(H.runCompact(r.filter((v) => i.values.includes(v.value)))),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    values: ["a"],
  },
  output: { result: { runs: [{ value: "a", length: "5" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "runs/length-record-value-selector",
  title: "Run Length Record Value Selector",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; select complete runs by an explicit allowed-value bank, then compact adjacent remaining equal runs; logical positions close after removal.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
