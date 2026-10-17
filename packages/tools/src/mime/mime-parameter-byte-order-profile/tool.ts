import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parametersJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "parametersJson", label: "parametersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.parameterRecords(i.parametersJson),
    text = H.parameterText(r);
  let p = 0;
  return H.finish({
    text,
    spans: r.map((v) => {
      const part = H.parameterText([v]),
        start = p;
      p += part.length + 2;
      return { name: v.name, start, end: start + part.length };
    }),
  });
};
export const example = {
  input: {
    parametersJson: '[{"name":"a","value":"x"},{"name":"b","value":"y"}]',
  },
  output: {
    result: {
      text: "a=x; b=y",
      spans: [
        { name: "a", start: 0, end: 3 },
        { name: "b", start: 5, end: 8 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIME Parameter Byte Order Profile", "MIME", "encoding"],
    collections: ["encode-decode"],
    fields: ["MIME", "encoding"],
    keywords: ["MIME", "encoding"],
  },
  id: "mime/mime-parameter-byte-order-profile",
  title: "MIME Parameter Byte Order Profile",
  description:
    "Profile byte-order source spans in canonical Latin-1 MIME parameter serialization, retaining occurrence order; not machine endianness or Unicode encoding detection.",
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
          text: { type: "string" },
          spans: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["name", "start", "end"],
            },
          },
        },
        required: ["text", "spans"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
