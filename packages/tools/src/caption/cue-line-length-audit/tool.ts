import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string; limit: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "limit", kind: "integer", label: "limit" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.int(i.limit, 0, 8192);
  return H.finish({
    violations: r.flatMap((v, cueIndex) =>
      v.text
        .split(/\r\n|\r|\n/)
        .flatMap((s, lineIndex) =>
          s.length > i.limit ? [{ cueIndex, lineIndex, length: s.length }] : [],
        ),
    ),
  });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
    limit: 1,
  },
  output: {
    result: {
      violations: [
        { cueIndex: 0, lineIndex: 0, length: 2 },
        { cueIndex: 1, lineIndex: 0, length: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-line-length-audit",
  title: "Caption Cue Line Length Audit",
  description:
    "Audit per-line UTF-16 cue lengths against an explicit limit, retaining cue/line indexes; does not count rendered glyph widths.",
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
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                cueIndex: { type: "number" },
                lineIndex: { type: "number" },
                length: { type: "number" },
              },
              required: ["cueIndex", "lineIndex", "length"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
