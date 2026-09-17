import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ word: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", kind: "string", label: "word" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.word);
  const j = i.word.lastIndexOf("01");
  if (j < 0) return H.finish({ word: null });
  const tail = i.word.slice(j + 2),
    ones = tail.split("").filter((x) => x === "1").length;
  return H.finish({
    word:
      i.word.slice(0, j) +
      "10" +
      "0".repeat(tail.length - ones) +
      "1".repeat(ones),
  });
};
export const example = {
  input: { word: "0011" },
  output: { result: { word: "0101" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/binary-word-fixed-weight-next",
  title: "Next Fixed Weight Binary Word",
  description:
    "Return the next lexicographic binary word with the same length and one-count, without wraparound; null marks the last fixed-weight word.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
