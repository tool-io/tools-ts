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
  const r = H.declarations(i.text);
  return H.finish({
    winners: H.groups(r, (v) => v.name).map((g) => {
      const important = g.indexes.filter((j) => r[j].important),
        indexes = important.length ? important : g.indexes;
      const index = indexes.at(-1)!;
      return { ...r[index], index };
    }),
  });
};
export const example = {
  input: { text: "a:1!important;a:2" },
  output: {
    result: {
      winners: [
        { name: "a", value: "1", important: true, start: 0, end: 13, index: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["CSS Declaration Source Order Winners", "CSS", "web development"],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/declaration-source-order-winners",
  title: "CSS Declaration Source Order Winners",
  description:
    "Select important-aware last declarations within one declaration list; no selector specificity, origin/layer cascade, shorthand expansion or value validity model.",
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
          winners: {
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
                index: { type: "number" },
              },
              required: ["name", "value", "important", "start", "end", "index"],
            },
          },
        },
        required: ["winners"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
