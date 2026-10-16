import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ attributesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "attributesJson", kind: "string", label: "attributesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    duplicates: H.duplicates(H.attributes(i.attributesJson), (v) => v.name),
  });
};
export const example = {
  input: {
    attributesJson:
      '[{"name":"ID","value":"a"},{"name":"id","value":"b"},{"name":"class","value":"c"}]',
  },
  output: { result: { duplicates: [{ key: "id", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/attribute-occurrence-duplicate-audit",
  title: "HTML Attribute Occurrence Duplicate Audit",
  description:
    "Audit duplicate attribute occurrences under HTML ASCII name lowercase without parsing a tag or losing duplicates; supplied occurrence indexes remain observable.",
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
