import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string; offset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "offset", kind: "integer", label: "offset" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.int(i.offset, -1e12, 1e12);
  H.check(r.every((v) => v.start + i.offset >= 0));
  return H.finish({
    cues: r.map((v) => ({
      ...v,
      start: v.start + i.offset,
      end: v.end + i.offset,
    })),
  });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
    offset: 2,
  },
  output: {
    result: {
      cues: [
        { id: "a", start: 2, end: 6, text: "hi" },
        { id: "b", start: 5, end: 8, text: "hi" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-time-offset-applier",
  title: "Caption Cue Time Offset Applier",
  description:
    "Shift caption times by an explicit signed millisecond offset, rejecting negative results and preserving cue text/IDs.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
