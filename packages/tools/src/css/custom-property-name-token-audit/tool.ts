import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ name: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "name", label: "name", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ valid: /^--[A-Za-z0-9_-]+(?![\s\S])/.test(i.name) });
};
export const example = {
  input: { name: "--x" },
  output: { result: { valid: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["CSS Custom Property Name Token Audit", "CSS", "web development"],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/custom-property-name-token-audit",
  title: "CSS Custom Property Name Token Audit",
  description:
    "Audit a deliberately restricted ASCII custom-property token grammar -- followed by letters/digits/underscore/dash; not full CSS identifier validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { valid: { type: "boolean" } },
        required: ["valid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
