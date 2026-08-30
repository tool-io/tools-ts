import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fragmentCounts: readonly number[];
  readonly effectiveLengthsBp: readonly number[];
  readonly mappedFragments: number;
}>;
export type Output = Readonly<{
  readonly fpkm: readonly number[];
  readonly sumFpkm: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.fragmentCounts.length;
  if (
    n === 0 ||
    input.effectiveLengthsBp.length !== n ||
    input.mappedFragments <= 0 ||
    input.fragmentCounts.some((v) => v < 0) ||
    input.effectiveLengthsBp.some((v) => v <= 0)
  )
    simpleError(
      "fragmentCounts",
      "Aligned fragment counts, positive lengths and mapped fragments required.",
    );
  const fpkm = input.fragmentCounts.map(
    (v, i) => (v * 1e9) / (input.mappedFragments * input.effectiveLengthsBp[i]),
  );
  return { fpkm, sumFpkm: fpkm.reduce((a, b) => a + b, 0) };
};
export const exampleInput = {
  fragmentCounts: [10, 20],
  effectiveLengthsBp: [1000, 2000],
  mappedFragments: 1000000,
} satisfies Input;
export const exampleOutput = { fpkm: [10, 10], sumFpkm: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/fragments-per-kilobase-million",
  title: "Fragments Per Kilobase Million",
  description:
    "Calculate fragments per kilobase of transcript per million mapped fragments.",
  inputs: [
    { id: "fragmentCounts", kind: "numberList", label: "Fragment counts" },
    {
      id: "effectiveLengthsBp",
      kind: "numberList",
      label: "Effective lengths bp",
    },
    { id: "mappedFragments", kind: "number", label: "Mapped fragments" },
  ],
  outputs: [
    { id: "fpkm", kind: "numberList", label: "Fpkm" },
    { id: "sumFpkm", kind: "number", label: "Sum fpkm" },
  ],
  calculate: (value) =>
    calculate({
      fragmentCounts: value.fragmentCounts as readonly number[],
      effectiveLengthsBp: value.effectiveLengthsBp as readonly number[],
      mappedFragments: value.mappedFragments as number,
    }),
});
export const run = tool.execute;
export default tool;
