import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string; separator: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "separator", kind: "string", label: "separator" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  return H.finish({
    cues: r.map((v) => ({
      ...v,
      text: v.text.split(/\r\n|\r|\n/).join(i.separator),
    })),
  });
};
export const example = {
  input: {
    cuesJson: '[{"id":"x","start":0,"end":1,"text":"a\\nb"}]',
    separator: " ",
  },
  output: { result: { cues: [{ id: "x", start: 0, end: 1, text: "a b" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-single-line-join",
  title: "Caption Cue Single Line Join",
  description:
    "Join physical cue text lines with an explicit separator while preserving leading/trailing empty lines and timing evidence.",
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
