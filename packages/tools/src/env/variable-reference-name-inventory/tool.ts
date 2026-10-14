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
  return H.finish({ references: H.envRefs(i.text) });
};
export const example = {
  input: { text: "$A ${B} $$A" },
  output: {
    result: {
      references: [
        { name: "A", start: 0, end: 2 },
        { name: "B", start: 3, end: 7 },
        { name: "A", start: 9, end: 11 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Environment Variable Reference Name Inventory",
      "environment variables",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["env", "environment variables", "software development"],
    keywords: ["environment variables", "software development"],
  },
  id: "env/variable-reference-name-inventory",
  title: "Environment Variable Reference Name Inventory",
  description:
    "Inventory literal $NAME or ${NAME} reference syntax with UTF-16 spans; no shell quoting, escapes, operators or double-dollar PID semantics are interpreted.",
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
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["name", "start", "end"],
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
