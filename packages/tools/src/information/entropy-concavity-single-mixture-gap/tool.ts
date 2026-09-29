import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  first: readonly number[];
  second: readonly number[];
  firstWeight: number;
  base: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "first", label: "First", kind: "numberList" },
  { id: "second", label: "Second", kind: "numberList" },
  { id: "firstWeight", label: "First weight", kind: "number" },
  { id: "base", label: "Base", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.first.length > 0 && i.first.length === i.second.length && i.base > 1,
  );
  H.bounded(i.firstWeight, 0, 1);
  for (const p of [i.first, i.second]) {
    p.forEach((x) => H.bounded(x, 0, 1));
    H.check(Math.abs(p.reduce((s, x) => s + x, 0) - 1) <= 1e-12);
  }
  const entropy = (p: readonly number[]) =>
      p.reduce(
        (s, x) => s + (x === 0 ? 0 : (-x * Math.log(x)) / Math.log(i.base)),
        0,
      ),
    a = entropy(i.first),
    b = entropy(i.second),
    m = entropy(
      i.first.map(
        (x, j) => i.firstWeight * x + (1 - i.firstWeight) * i.second[j],
      ),
    );
  return H.finish({
    firstEntropy: a,
    secondEntropy: b,
    mixtureEntropy: m,
    concavityGap: m - i.firstWeight * a - (1 - i.firstWeight) * b,
  });
};
export const example = {
  input: { first: [1, 0], second: [0, 1], firstWeight: 0.5, base: 2 },
  output: {
    result: {
      firstEntropy: 0,
      secondEntropy: 0,
      mixtureEntropy: 1,
      concavityGap: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/entropy-concavity-single-mixture-gap",
  title: "Information: Entropy Concavity Single Mixture Gap Tool",
  description:
    "Compute the entropy concavity gap of two normalized bounded distributions on a shared explicit support; no fitting or inferred category alignment.",
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
          concavityGap: { type: "number" },
          firstEntropy: { type: "number" },
          mixtureEntropy: { type: "number" },
          secondEntropy: { type: "number" },
        },
        required: [
          "concavityGap",
          "firstEntropy",
          "mixtureEntropy",
          "secondEntropy",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
