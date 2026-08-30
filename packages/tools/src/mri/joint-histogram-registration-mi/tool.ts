import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly jointBinCounts: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly mutualInformationBits: number;
  readonly firstEntropyBits: number;
  readonly secondEntropyBits: number;
  readonly normalizedMutualInformation: number;
}>;
const inputFields = [
  { id: "jointBinCounts", label: "Joint bin counts", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = input.jointBinCounts,
    n = a.length,
    m = a[0]?.length ?? 0;
  if (
    !n ||
    !m ||
    a.some(
      (row) =>
        row.length !== m || row.some((v) => !Number.isSafeInteger(v) || v < 0),
    )
  )
    simpleError(
      "jointBinCounts",
      "Rectangular nonnegative integer joint histogram required.",
    );
  const total = positive(
      a.reduce((s, row) => s + row.reduce((x, y) => x + y, 0), 0),
      "jointBinCounts",
    ),
    rows = a.map((row) => row.reduce((x, y) => x + y, 0) / total),
    cols = Array.from(
      { length: m },
      (_, j) => a.reduce((s, row) => s + row[j], 0) / total,
    ),
    entropy = (p: readonly number[]) =>
      -p.reduce((s, v) => s + (v === 0 ? 0 : v * Math.log2(v)), 0),
    firstEntropyBits = entropy(rows),
    secondEntropyBits = entropy(cols);
  count(total, "jointBinCounts", 1);
  let jointEntropy = 0;
  for (const row of a)
    for (const v of row)
      if (v > 0) jointEntropy -= (v / total) * Math.log2(v / total);
  positive(jointEntropy, "jointBinCounts");
  return {
    mutualInformationBits: firstEntropyBits + secondEntropyBits - jointEntropy,
    firstEntropyBits,
    secondEntropyBits,
    normalizedMutualInformation:
      (firstEntropyBits + secondEntropyBits) / jointEntropy,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  jointBinCounts: [
    [5, 0],
    [0, 5],
  ],
} satisfies Input;
export const exampleOutput = {
  mutualInformationBits: 1,
  firstEntropyBits: 1,
  secondEntropyBits: 1,
  normalizedMutualInformation: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/joint-histogram-registration-mi",
  title: "Registration Cost Function MI",
  description:
    "Score supplied image-pair joint histograms with MI and Studholme NMI=(H1+H2)/Hjoint; does not perform registration search or select bin edges.",
  inputs: inputFields,
  outputs: [
    {
      id: "mutualInformationBits",
      label: "Mutual information bits",
      kind: "number",
    },
    { id: "firstEntropyBits", label: "First entropy bits", kind: "number" },
    { id: "secondEntropyBits", label: "Second entropy bits", kind: "number" },
    {
      id: "normalizedMutualInformation",
      label: "Normalized mutual information",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      jointBinCounts: value.jointBinCounts as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
