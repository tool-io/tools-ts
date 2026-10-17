import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ values: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "values", label: "values", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  i.values.forEach(H.quoted);
  return H.finish({
    values: i.values.map((value) => ({
      value,
      quoted: !H.token(value),
      serialized: H.token(value) ? value : H.quoted(value),
    })),
  });
};
export const example = {
  input: { values: ["a", "x y", ""] },
  output: {
    result: {
      values: [
        { value: "a", quoted: false, serialized: "a" },
        { value: "x y", quoted: true, serialized: '"x y"' },
        { value: "", quoted: true, serialized: '""' },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["MIME Parameter Quotedness Plan", "MIME", "encoding"],
    collections: ["encode-decode"],
    fields: ["MIME", "encoding"],
    keywords: ["MIME", "encoding"],
  },
  id: "mime/mime-parameter-quotedness-plan",
  title: "MIME Parameter Quotedness Plan",
  description:
    "Plan MIME parameter value token versus quoted-string spelling, including empty strings and escaped quotes; not a charset/extended-parameter encoder.",
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
          values: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                value: { type: "string" },
                quoted: { type: "boolean" },
                serialized: { type: "string" },
              },
              required: ["value", "quoted", "serialized"],
            },
          },
        },
        required: ["values"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
