import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ spansJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "spansJson", label: "spansJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const s = H.zoneSpans(i.spansJson);
  H.check(s.every((v, j) => !j || v.start >= s[j - 1].end));
  const out: H.OffsetSpan[] = [];
  for (const v of s) {
    const p = out.at(-1);
    if (p && p.end === v.start && p.offset === v.offset) p.end = v.end;
    else out.push({ ...v });
  }
  return H.finish({ spans: out });
};
export const example = {
  input: {
    spansJson:
      '[{"start":0,"end":1,"offset":2},{"start":1,"end":3,"offset":2}]',
  },
  output: { result: { spans: [{ start: 0, end: 3, offset: 2 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-span-adjacent-compactor",
  title: "Time Zone Offset Span Adjacent Compactor",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; compact only adjacent ordered touching spans with exactly equal offsets, rejecting reversed/overlapping input rather than hiding conflicts. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
