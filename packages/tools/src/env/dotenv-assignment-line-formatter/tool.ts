import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ name: string; value: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "name", label: "name", kind: "string" },
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.assignments(JSON.stringify([{ name: i.name, value: i.value }]));
  return H.finish({ line: i.name + "=" + JSON.stringify(i.value) });
};
export const example = {
  input: { name: "A", value: "x\ny" },
  output: { result: { line: 'A="x\\ny"' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Restricted Dotenv Assignment Line Formatter",
      "environment variables",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["env", "environment variables", "software development"],
    keywords: ["environment variables", "software development"],
  },
  id: "env/dotenv-assignment-line-formatter",
  title: "Restricted Dotenv Assignment Line Formatter",
  description:
    "Format one portable environment assignment using the documented literal JSON-double dotenv subset; never expands dollar references or emits a shell command.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { line: { type: "string" } },
        required: ["line"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
