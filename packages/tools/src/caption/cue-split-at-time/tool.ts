import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string; at: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "at", kind: "integer", label: "at" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.int(i.at, 0, 1e12);
  return H.finish({
    cues: r.flatMap((v) =>
      v.start < i.at && i.at < v.end
        ? [
            { ...v, end: i.at },
            { ...v, start: i.at },
          ]
        : [v],
    ),
  });
};
export const example = {
  input: {
    cuesJson: '[{"id": "a", "start": 0, "end": 4, "text": "hi"}]',
    at: 2,
  },
  output: {
    result: {
      cues: [
        { id: "a", start: 0, end: 2, text: "hi" },
        { id: "a", start: 2, end: 4, text: "hi" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-split-at-time",
  title: "Caption Cue Split at Time",
  description:
    "Split cue intervals strictly containing an explicit time; duplicated text and IDs are intentional, not re-transcribed speech.",
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
                start: { type: "number" },
                end: { type: "number" },
                text: { type: "string" },
              },
              required: ["id", "start", "end", "text"],
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
