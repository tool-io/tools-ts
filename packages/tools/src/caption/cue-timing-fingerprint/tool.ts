import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cuesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  return H.finish({
    fingerprint: JSON.stringify(r.map((v) => [v.start, v.end])),
  });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
  },
  output: { result: { fingerprint: "[[0,4],[3,6]]" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-timing-fingerprint",
  title: "Caption Cue Timing Fingerprint",
  description:
    "Serialize ordered cue timing pairs as an exact noncryptographic fingerprint; excludes IDs/text and is not a collision-resistant hash.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { fingerprint: { type: "string" } },
        required: ["fingerprint"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
