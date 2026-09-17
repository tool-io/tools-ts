import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "numberList", label: "left" },
  { id: "right", kind: "numberList", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.left.length === i.right.length);
  const concordant: number[][] = [],
    discordant: number[][] = [],
    tied: number[][] = [];
  for (let j = 0; j < i.left.length; j++)
    for (let k = j + 1; k < i.left.length; k++) {
      const a = Math.sign(i.left[j] - i.left[k]),
        b = Math.sign(i.right[j] - i.right[k]);
      (!a || !b ? tied : a === b ? concordant : discordant).push([j, k]);
    }
  return H.finish({ concordant, discordant, tied });
};
export const example = {
  input: { left: [1, 2, 3], right: [1, 3, 2] },
  output: {
    result: {
      concordant: [
        [0, 1],
        [0, 2],
      ],
      discordant: [[1, 2]],
      tied: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/rank-order-agreement-pairs",
  title: "Rank Order Agreement Pairs",
  description:
    "Classify numeric rank-order pair agreement and disagreement while retaining all pairs tied in either observation; not a normalized correlation coefficient.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
