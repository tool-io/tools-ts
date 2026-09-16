import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.check(r.every((v, j) => j === 0 || v.start >= r[j - 1].start));
  return H.finish({
    gaps: r.slice(1).map((v, j) => ({
      fromId: r[j].id,
      toId: v.id,
      gap: v.start - r[j].end,
    })),
  });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
  },
  output: { result: { gaps: [{ fromId: "a", toId: "b", gap: -1 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-gap-table",
  title: "Caption Cue Gap Table",
  description:
    "Report signed adjacent caption timing gaps in sorted start order; negative gaps retain overlap evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
