import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ value: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ references: H.cssReferences(i.value) });
};
export const example = {
  input: { value: 'var(--a, var(--b)) "var(--c)"' },
  output: {
    result: {
      references: [
        { name: "--a", position: 0 },
        { name: "--b", position: 9 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "CSS Custom Property Reference Inventory",
      "CSS",
      "web development",
    ],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/custom-property-reference-inventory",
  title: "CSS Custom Property Reference Inventory",
  description:
    "Inventory unescaped ASCII var() reference names including nested fallbacks, ignoring quoted strings; existing variable-parser extracts declarations instead. Comment-free balanced CSS subset.",
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
          references: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                position: { type: "number" },
              },
              required: ["name", "position"],
            },
          },
        },
        required: ["references"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
