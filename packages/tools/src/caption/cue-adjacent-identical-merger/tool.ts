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
  const cues: { ids: string[]; start: number; end: number; text: string }[] =
    [];
  for (const v of r) {
    const p = cues.at(-1);
    if (p && p.text === v.text && v.start <= p.end) {
      p.end = Math.max(p.end, v.end);
      p.ids.push(v.id);
    } else cues.push({ ids: [v.id], start: v.start, end: v.end, text: v.text });
  }
  return H.finish({ cues });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
  },
  output: {
    result: { cues: [{ ids: ["a", "b"], start: 0, end: 6, text: "hi" }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-adjacent-identical-merger",
  title: "Caption Adjacent Identical Merger",
  description:
    "Merge adjacent sorted cues with exact identical text only when touching or overlapping; retain all contributing IDs.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
