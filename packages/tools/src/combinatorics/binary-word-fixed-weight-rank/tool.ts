import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ word: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "word", kind: "string", label: "word" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bits(i.word);
  const zeros = i.word.split("").flatMap((x, j) => (x === "0" ? [j] : []));
  return H.finish({ rank: String(H.comboRank(zeros, i.word.length)) });
};
export const example = {
  input: { word: "0101" },
  output: { result: { rank: "1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/binary-word-fixed-weight-rank",
  title: "Fixed Weight Binary Word Rank",
  description:
    "Rank a fixed-weight binary word lexicographically by its zero-position combination, using exact zero-based integer text.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { rank: { type: "string" } },
        required: ["rank"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
