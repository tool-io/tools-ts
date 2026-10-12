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
    indexes: r.flatMap((v, j) => (v.text.trim() === "" ? [j] : [])),
  });
};
export const example = {
  input: { cuesJson: '[{"id":"x","start":0,"end":1,"text":" \\n"}]' },
  output: { result: { indexes: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-empty-text-audit",
  title: "Caption Empty Text Audit",
  description:
    "Identify caption cues whose text is empty after JavaScript whitespace trimming; does not interpret markup or infer speech.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { indexes: { type: "array", items: { type: "number" } } },
        required: ["indexes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
