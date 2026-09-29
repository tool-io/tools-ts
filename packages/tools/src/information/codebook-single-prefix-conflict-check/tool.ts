import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ firstCodeword: string; secondCodeword: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstCodeword", label: "First codeword", kind: "string" },
  { id: "secondCodeword", label: "Second codeword", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^[01]*(?![\s\S])/.test(i.firstCodeword) &&
      /^[01]*(?![\s\S])/.test(i.secondCodeword),
  );
  return H.finish({
    firstPrefixesSecond: i.secondCodeword.startsWith(i.firstCodeword),
    secondPrefixesFirst: i.firstCodeword.startsWith(i.secondCodeword),
    equal: i.firstCodeword === i.secondCodeword,
    prefixConflict:
      i.secondCodeword.startsWith(i.firstCodeword) ||
      i.firstCodeword.startsWith(i.secondCodeword),
  });
};
export const example = {
  input: { firstCodeword: "01", secondCodeword: "011" },
  output: {
    result: {
      firstPrefixesSecond: true,
      secondPrefixesFirst: false,
      equal: false,
      prefixConflict: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/codebook-single-prefix-conflict-check",
  title: "Information: Codebook Single Prefix Conflict Check Tool",
  description:
    "Inspect one pair of binary codewords for either-direction prefix conflict, including empty-word and duplicate conflicts; not whole-codebook validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equal: { type: "boolean" },
          firstPrefixesSecond: { type: "boolean" },
          prefixConflict: { type: "boolean" },
          secondPrefixesFirst: { type: "boolean" },
        },
        required: [
          "equal",
          "firstPrefixesSecond",
          "prefixConflict",
          "secondPrefixesFirst",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
