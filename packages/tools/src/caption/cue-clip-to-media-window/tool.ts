import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string; start: number; end: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "start", kind: "integer", label: "start" },
  { id: "end", kind: "integer", label: "end" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.int(i.start, 0, 1e12);
  H.int(i.end, i.start, 1e12);
  return H.finish({
    cues: r.flatMap((v) => {
      const start = Math.max(v.start, i.start),
        end = Math.min(v.end, i.end);
      return start < end ? [{ ...v, start, end }] : [];
    }),
  });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
    start: 2,
    end: 5,
  },
  output: {
    result: {
      cues: [
        { id: "a", start: 2, end: 4, text: "hi" },
        { id: "b", start: 3, end: 5, text: "hi" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-clip-to-media-window",
  title: "Caption Cue Clip to Media Window",
  description:
    "Clip caption intervals to a half-open media window and discard empty intersections without altering IDs or text.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cues: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                text: { type: "string" },
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["id", "text", "start", "end"],
            },
          },
        },
        required: ["cues"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
