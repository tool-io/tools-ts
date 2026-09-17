import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.text.length <= 128);
  const pairs: number[][] = [];
  for (let j = 0; j < Math.floor(i.text.length / 2); j++)
    if (i.text[j] !== i.text[i.text.length - 1 - j])
      pairs.push([j, i.text.length - 1 - j]);
  const positions =
    pairs.length === 1
      ? pairs[0]
      : pairs.length === 0 && i.text.length % 2 === 1
        ? [Math.floor(i.text.length / 2)]
        : [];
  return H.finish({ possible: positions.length > 0, positions });
};
export const example = {
  input: { text: "abca" },
  output: { result: { possible: true, positions: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/palindrome-single-substitution-positions",
  title: "Palindrome Single Substitution Positions",
  description:
    "Bounded UTF-16 string palindrome single substitution positions; exact code-unit matching, no Unicode normalization or grapheme inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
