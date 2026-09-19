import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ transitionsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.zoneTransitions(i.transitionsJson);
  return H.finish({
    duplicateInstants: H.duplicates(t, (v) => String(v.at)),
    nonIncreasing: t.flatMap((v, j) => (j && v.at <= t[j - 1].at ? [j] : [])),
    discontinuous: t.flatMap((v, j) =>
      j && v.before !== t[j - 1].after ? [j] : [],
    ),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"at": 10, "before": 0, "after": 2}, {"at": 20, "before": 2, "after": 0}]',
  },
  output: {
    result: { duplicateInstants: [], nonIncreasing: [], discontinuous: [] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-transition-record-audit",
  title: "Time Zone Offset Transition Record Audit",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; audit transition chronological order, duplicate instants and adjacent before/after offset continuity without sorting or repairing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
