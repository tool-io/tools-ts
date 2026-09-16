import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string; start: number; end: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "start", kind: "integer", label: "start" },
  { id: "end", kind: "integer", label: "end" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.int(i.start, 0, 1e12);
  H.int(i.end, i.start, 1e12);
  return H.finish({
    texts: r
      .filter((v) => Math.max(v.start, i.start) < Math.min(v.end, i.end))
      .map((v) => ({ id: v.id, text: v.text })),
  });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
    start: 4,
    end: 5,
  },
  output: { result: { texts: [{ id: "b", text: "hi" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-window-text-extractor",
  title: "Caption Cue Window Text Extractor",
  description:
    "Extract ID/text observations from cues with positive half-open overlap of an explicit media window; not a transcript alignment model.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
