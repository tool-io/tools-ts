import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  cuesJson: string;
  minimum: number;
  maximum: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "minimum", kind: "integer", label: "minimum" },
  { id: "maximum", kind: "integer", label: "maximum" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.int(i.minimum);
  H.int(i.maximum, i.minimum);
  return H.finish({
    violations: r.flatMap((v, index) =>
      v.end - v.start < i.minimum || v.end - v.start > i.maximum
        ? [{ index, id: v.id, duration: v.end - v.start }]
        : [],
    ),
  });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
    minimum: 4,
    maximum: 5,
  },
  output: { result: { violations: [{ index: 1, id: "b", duration: 3 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-duration-bound-audit",
  title: "Caption Cue Duration Bound Audit",
  description:
    "Audit cue duration against caller-supplied inclusive millisecond bounds; no universal readability or accessibility claim.",
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
                index: { type: "number" },
                id: { type: "string" },
                duration: { type: "number" },
              },
              required: ["index", "id", "duration"],
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
