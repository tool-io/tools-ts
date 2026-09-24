import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  prefix: readonly number[];
  choose: number;
  universeSize: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prefix", label: "Prefix", kind: "numberList" },
  { id: "choose", label: "Choose", kind: "integer" },
  { id: "universeSize", label: "Universe size", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.universeSize, 0, 128);
  H.int(i.choose, 0, i.universeSize);
  H.check(
    i.prefix.length <= i.choose &&
      i.prefix.every(
        (x, j) =>
          Number.isInteger(x) &&
          x >= 0 &&
          x < i.universeSize &&
          (!j || x > i.prefix[j - 1]),
      ),
  );
  const start = (i.prefix[i.prefix.length - 1] ?? -1) + 1,
    tail =
      start + i.choose - i.prefix.length <= i.universeSize
        ? Array.from(
            { length: i.choose - i.prefix.length },
            (_, j) => start + j,
          )
        : [];
  return H.finish({
    minimumTail: tail,
    feasible: start + i.choose - i.prefix.length <= i.universeSize,
  });
};
export const example = {
  input: { prefix: [1, 3], choose: 4, universeSize: 7 },
  output: { result: { minimumTail: [4, 5], feasible: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/combination-prefix-minimum-tail",
  title: "Combinatorics: Combination Prefix Minimum Tail Tool",
  description:
    "Construct the lexicographically smallest remaining tail of a sorted zero-based combination prefix, with infeasible tails empty and no full combination enumeration.",
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
          feasible: { type: "boolean" },
          minimumTail: { type: "array", items: { type: "number" } },
        },
        required: ["feasible", "minimumTail"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
