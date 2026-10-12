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
  return H.finish({ duplicates: H.duplicates(r, (v) => v.id) });
};
export const example = {
  input: {
    cuesJson:
      '[{"id": "a", "start": 0, "end": 4, "text": "hi"}, {"id": "a", "start": 3, "end": 6, "text": "hi"}]',
  },
  output: { result: { duplicates: [{ key: "a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-id-duplicate-audit",
  title: "Caption Cue ID Duplicate Audit",
  description:
    "Audit repeated explicit caption IDs without assuming IDs are unique, renumbering or dropping observations.",
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
          duplicates: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
        },
        required: ["duplicates"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
