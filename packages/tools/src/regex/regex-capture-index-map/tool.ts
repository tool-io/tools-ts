import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ pattern: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pattern", kind: "string", label: "pattern" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ captures: H.captures(i.pattern) });
};
export const example = {
  input: { pattern: "(a)(?:b)(?<name>c)" },
  output: {
    result: {
      captures: [
        { index: 1, name: null, position: 0 },
        { index: 2, name: "name", position: 8 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/regex-capture-index-map",
  title: "Regex Capture Index Map",
  description:
    "Map ECMAScript capture indexes, names and opening-parenthesis UTF-16 positions after runtime syntax validation; escaped/class parentheses are ignored.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
