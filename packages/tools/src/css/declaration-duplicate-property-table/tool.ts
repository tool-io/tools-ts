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
  return H.finish({
    duplicates: H.duplicates(H.declarations(i.text), (v) => v.name),
  });
};
export const example = {
  input: { text: "Color:red;color:blue;--X:1;--x:2" },
  output: { result: { duplicates: [{ key: "color", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["CSS Duplicate Property Table", "CSS", "web development"],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/declaration-duplicate-property-table",
  title: "CSS Duplicate Property Table",
  description:
    "Audit declaration property duplicates with ordinary ASCII property folding and case-sensitive custom-property names; not a cascade engine.",
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
