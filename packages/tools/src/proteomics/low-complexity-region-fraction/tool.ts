import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sequenceLength: number;
  readonly regionStarts: readonly number[];
  readonly regionEnds: readonly number[];
  readonly minimumStretch: number;
}>;
export type Output = Readonly<{
  readonly longRegionCount: number;
  readonly coveredResidues: number;
  readonly lowComplexityFraction: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.regionStarts.length;
  if (
    !Number.isSafeInteger(input.sequenceLength) ||
    input.sequenceLength <= 0 ||
    n !== input.regionEnds.length ||
    input.regionStarts.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        !Number.isSafeInteger(input.regionEnds[i]) ||
        v < 0 ||
        v >= input.regionEnds[i] ||
        input.regionEnds[i] > input.sequenceLength,
    ) ||
    !Number.isSafeInteger(input.minimumStretch) ||
    input.minimumStretch < 1
  )
    simpleError(
      "regionStarts",
      "Valid low-complexity regions and minimum stretch required.",
    );
  const regions = input.regionStarts.flatMap((v, i) =>
      input.regionEnds[i] - v >= input.minimumStretch
        ? [[v, input.regionEnds[i]]]
        : [],
    ),
    covered = new Set<number>();
  for (const [start, end] of regions)
    for (let i = start; i < end; i++) covered.add(i);
  return {
    longRegionCount: regions.length,
    coveredResidues: covered.size,
    lowComplexityFraction: covered.size / input.sequenceLength,
  };
};
export const exampleInput = {
  sequenceLength: 10,
  regionStarts: [0, 5],
  regionEnds: [3, 9],
  minimumStretch: 3,
} satisfies Input;
export const exampleOutput = {
  longRegionCount: 2,
  coveredResidues: 7,
  lowComplexityFraction: 0.7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/low-complexity-region-fraction",
  title: "Low Complexity Region Fraction",
  description:
    "Union long low-complexity stretches and calculate their protein coverage.",
  inputs: [
    { id: "sequenceLength", label: "Sequence length", kind: "number" },
    { id: "regionStarts", label: "Region starts", kind: "numberList" },
    { id: "regionEnds", label: "Region ends", kind: "numberList" },
    { id: "minimumStretch", label: "Minimum stretch", kind: "number" },
  ],
  outputs: [
    { id: "longRegionCount", label: "Long region count", kind: "number" },
    { id: "coveredResidues", label: "Covered residues", kind: "number" },
    {
      id: "lowComplexityFraction",
      label: "Low complexity fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sequenceLength: value.sequenceLength as number,
      regionStarts: value.regionStarts as readonly number[],
      regionEnds: value.regionEnds as readonly number[],
      minimumStretch: value.minimumStretch as number,
    }),
});
export const run = tool.execute;
export default tool;
