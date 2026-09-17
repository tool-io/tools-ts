import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ replacement: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "replacement", kind: "string", label: "replacement" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ tokens: H.replacementTokens(i.replacement) });
};
export const example = {
  input: { replacement: "a$1$$" },
  output: {
    result: {
      tokens: [
        { type: "literal", text: "a", position: 0 },
        { type: "numbered", text: "$1", position: 1 },
        { type: "dollar", text: "$$", position: 3 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/regex-replacement-tokenizer",
  title: "Regex Replacement Tokenizer",
  description:
    "Tokenize ECMAScript replacement-dollar syntax without applying matches; numeric reference resolution depends on separately supplied capture evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
