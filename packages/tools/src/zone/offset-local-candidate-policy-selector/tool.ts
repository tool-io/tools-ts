import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  spansJson: string;
  local: number;
  policy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "spansJson", label: "spansJson", kind: "string" },
  { id: "local", label: "local", kind: "number" },
  { id: "policy", label: "policy", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const s = H.zoneSpans(i.spansJson);
  H.check(["earliest", "latest", "unique"].includes(i.policy));
  H.check(Math.abs(i.local) <= 1e12);
  const c = H.localCandidates(s, i.local).sort(
    (a, b) => a.utc - b.utc || a.index - b.index,
  );
  return H.finish({
    selected:
      c.length === 0
        ? null
        : i.policy === "earliest"
          ? c[0]
          : i.policy === "latest"
            ? c.at(-1)!
            : c.length === 1
              ? c[0]
              : null,
    candidateCount: c.length,
  });
};
export const example = {
  input: {
    spansJson:
      '[{"start": 0, "end": 10, "offset": 0}, {"start": 10, "end": 20, "offset": 2}, {"start": 20, "end": 30, "offset": 0}]',
    local: 21,
    policy: "earliest",
  },
  output: {
    result: { selected: { index: 1, utc: 19, offset: 2 }, candidateCount: 2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-local-candidate-policy-selector",
  title: "Time Zone Local Candidate Policy Selector",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; choose earliest/latest UTC candidate or unique-only under an explicit policy; empty or unresolved evidence returns null. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
