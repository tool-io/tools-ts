import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  first: readonly string[];
  second: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "first", label: "First", kind: "stringList" },
  { id: "second", label: "Second", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  let overlap = 0;
  for (let n = 1; n <= Math.min(i.first.length, i.second.length); n++)
    if (i.first.slice(-n).every((x, j) => x === i.second[j])) overlap = n;
  return H.finish({ overlapTokenCount: overlap });
};
export const example = {
  input: { first: ["x", "ab", "c"], second: ["ab", "c", "z"] },
  output: { result: { overlapTokenCount: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-short-prefix-suffix-overlap",
  title: "List: List Short Prefix Suffix Overlap Tool",
  description:
    "Return the longest exact token suffix/prefix overlap for two bounded string-token lists; no UTF-16 substring overlap or fuzzy token equality.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { overlapTokenCount: { type: "number" } },
        required: ["overlapTokenCount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
