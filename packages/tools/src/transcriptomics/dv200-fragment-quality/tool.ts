import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fragmentSizesNt: readonly number[];
  readonly fragmentCounts: readonly number[];
  readonly minimumLengthNt: number;
}>;
export type Output = Readonly<{
  readonly qualifyingFragments: number;
  readonly totalFragments: number;
  readonly dv200Percent: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.fragmentSizesNt.length;
  if (
    n === 0 ||
    n !== input.fragmentCounts.length ||
    input.fragmentCounts.some((v) => v < 0) ||
    input.fragmentSizesNt.some((v) => v < 0)
  )
    simpleError(
      "fragmentCounts",
      "Aligned nonnegative fragment sizes and counts required.",
    );
  const totalFragments = input.fragmentCounts.reduce((a, b) => a + b, 0);
  if (totalFragments <= 0)
    simpleError("fragmentCounts", "Total fragments must be positive.");
  const qualifyingFragments = input.fragmentSizesNt.reduce(
    (s, v, i) => s + (v > input.minimumLengthNt ? input.fragmentCounts[i] : 0),
    0,
  );
  return {
    qualifyingFragments,
    totalFragments,
    dv200Percent: (qualifyingFragments / totalFragments) * 100,
  };
};

export const exampleInput = {
  fragmentSizesNt: [100, 250, 300],
  fragmentCounts: [10, 20, 30],
  minimumLengthNt: 200,
} satisfies Input;
export const exampleOutput = {
  qualifyingFragments: 50,
  totalFragments: 60,
  dv200Percent: 83.33333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/dv200-fragment-quality",
  title: "DV200 Fragment Quality",
  description:
    "Calculate the share of RNA fragments longer than a user-selected cutoff.",
  inputs: [
    { id: "fragmentSizesNt", kind: "numberList", label: "Fragment sizes nt" },
    { id: "fragmentCounts", kind: "numberList", label: "Fragment counts" },
    { id: "minimumLengthNt", kind: "number", label: "Minimum length nt" },
  ],
  outputs: [
    {
      id: "qualifyingFragments",
      kind: "number",
      label: "Qualifying fragments",
    },
    { id: "totalFragments", kind: "number", label: "Total fragments" },
    { id: "dv200Percent", kind: "number", label: "Dv 200 percent" },
  ],
  calculate: (value) =>
    calculate({
      fragmentSizesNt: value.fragmentSizesNt as readonly number[],
      fragmentCounts: value.fragmentCounts as readonly number[],
      minimumLengthNt: value.minimumLengthNt as number,
    }),
});
export const run = tool.execute;
export default tool;
