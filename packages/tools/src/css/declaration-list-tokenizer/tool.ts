import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ declarations: H.declarations(i.text) });
};
export const example = {
  input: { text: "a:1;b:2" },
  output: {
    result: {
      declarations: [
        { name: "a", value: "1", important: false, start: 0, end: 3 },
        { name: "b", value: "2", important: false, start: 4, end: 7 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["CSS Declaration List Tokenizer", "CSS", "web development"],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/declaration-list-tokenizer",
  title: "CSS Declaration List Tokenizer",
  description:
    "Tokenize a restricted CSS declaration list with UTF-16 source spans and balanced strings/groups; comments and escaped property identifiers are unsupported.",
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
          declarations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                value: { type: "string" },
                important: { type: "boolean" },
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["name", "value", "important", "start", "end"],
            },
          },
        },
        required: ["declarations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
