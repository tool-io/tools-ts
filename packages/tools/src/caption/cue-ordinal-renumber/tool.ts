import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string; first: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "first", kind: "integer", label: "first" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.int(i.first, 1, 1e9);
  return H.finish({ cues: r.map((v, j) => ({ ...v, ordinal: i.first + j })) });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
    first: 5,
  },
  output: {
    result: {
      cues: [
        { id: "a", start: 0, end: 4, text: "hi", ordinal: 5 },
        { id: "b", start: 3, end: 6, text: "hi", ordinal: 6 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-ordinal-renumber",
  title: "Caption Cue Ordinal Renumber",
  description:
    "Attach sequential explicit cue ordinals from a positive starting number; existing IDs and caller order remain unchanged.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
