import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parametersJson: string; name: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "parametersJson", label: "parametersJson", kind: "string" },
  { id: "name", label: "name", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(H.token(i.name));
  const r = H.parameterRecords(i.parametersJson);
  return H.finish({
    parameters: r.flatMap((v, index) =>
      v.name === i.name.toLowerCase() ? [{ ...v, index }] : [],
    ),
  });
};
export const example = {
  input: {
    parametersJson: '[{"name":"A","value":"1"},{"name":"a","value":"2"}]',
    name: "A",
  },
  output: {
    result: {
      parameters: [
        { name: "a", value: "1", index: 0 },
        { name: "a", value: "2", index: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Media Type Parameter Selector", "MIME", "encoding"],
    collections: ["encode-decode"],
    fields: ["MIME", "encoding"],
    keywords: ["MIME", "encoding"],
  },
  id: "mime/media-type-parameter-selector",
  title: "Media Type Parameter Selector",
  description:
    "Select every ordered MIME parameter occurrence by case-insensitive token name; preserve duplicate values rather than first/last wins.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parameters: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                value: { type: "string" },
                index: { type: "number" },
              },
              required: ["name", "value", "index"],
            },
          },
        },
        required: ["parameters"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
