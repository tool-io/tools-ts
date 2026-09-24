import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ prefix: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prefix", label: "Prefix", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  let max = -1;
  for (const x of i.prefix) {
    H.int(x, 0, max + 1);
    max = Math.max(max, x);
  }
  return H.finish({
    nextMinimum: 0,
    nextMaximum: i.prefix.length === 0 ? 0 : Math.max(...i.prefix) + 1,
  });
};
export const example = {
  input: { prefix: [0, 1, 0, 2] },
  output: { result: { nextMinimum: 0, nextMaximum: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/restricted-growth-string-next-symbol-bound",
  title: "Combinatorics: Restricted Growth String Next Symbol Bound Tool",
  description:
    "Validate one zero-based restricted-growth-string prefix and return its next-symbol bound, with an empty prefix requiring first symbol zero.",
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
          nextMaximum: { type: "number" },
          nextMinimum: { type: "number" },
        },
        required: ["nextMaximum", "nextMinimum"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
