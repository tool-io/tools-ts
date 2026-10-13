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
  return H.finish(H.important(i.value));
};
export const example = {
  input: { value: "red ! IMPORTANT " },
  output: { result: { value: "red", important: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["CSS Important Suffix Parser", "CSS", "web development"],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/declaration-important-suffix-parser",
  title: "CSS Important Suffix Parser",
  description:
    "Parse an unquoted top-level terminal important suffix in a balanced restricted CSS value; comments are rejected.",
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
          value: { type: "string" },
          important: { type: "boolean" },
        },
        required: ["value", "important"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
