import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly regionNames: readonly string[];
  readonly regionStarts: readonly number[];
  readonly regionEnds: readonly number[];
  readonly coveredStarts: readonly number[];
  readonly coveredEnds: readonly number[];
}>;
export type Output = Readonly<{
  readonly coveredBases: readonly number[];
  readonly coveragePercent: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.regionNames, input.regionStarts, "regionNames");
  if (
    input.regionStarts.length * Math.max(1, input.coveredStarts.length) >
    1000000
  )
    simpleError(
      "regionStarts",
      "Coverage comparisons exceed the interval budget.",
    );
  aligned(input.regionStarts, input.regionEnds, "regionStarts");
  if (
    input.coveredStarts.length !== input.coveredEnds.length ||
    input.regionStarts.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        v < 0 ||
        !Number.isSafeInteger(input.regionEnds[i]) ||
        v >= input.regionEnds[i],
    ) ||
    input.coveredStarts.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        v < 0 ||
        !Number.isSafeInteger(input.coveredEnds[i]) ||
        v >= input.coveredEnds[i],
    )
  )
    simpleError(
      "regionStarts",
      "Valid aligned half-open region and coverage intervals required.",
    );
  const intervals = input.coveredStarts
      .map((v, i) => [v, input.coveredEnds[i]])
      .sort((a, b) => a[0] - b[0]),
    merged: number[][] = [];
  for (const item of intervals) {
    const last = merged[merged.length - 1];
    if (last && item[0] <= last[1]) last[1] = Math.max(last[1], item[1]);
    else merged.push([...item]);
  }
  const coveredBases = input.regionStarts.map((start, i) =>
    merged.reduce(
      (sum, [a, b]) =>
        sum +
        Math.max(0, Math.min(b, input.regionEnds[i]) - Math.max(a, start)),
      0,
    ),
  );
  return {
    coveredBases,
    coveragePercent: coveredBases.map(
      (v, i) => (100 * v) / (input.regionEnds[i] - input.regionStarts[i]),
    ),
  };
};
export const exampleInput = {
  regionNames: ["HV1", "HV2"],
  regionStarts: [0, 100],
  regionEnds: [50, 150],
  coveredStarts: [10, 90],
  coveredEnds: [40, 160],
} satisfies Input;
export const exampleOutput = {
  coveredBases: [30, 50],
  coveragePercent: [60, 100],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/mitochondrial-region-coverage",
  title: "Mitochondrial Region Coverage",
  description:
    "Map unioned sequence coverage to caller-defined mitochondrial hypervariable regions.",
  inputs: [
    { id: "regionNames", label: "Region names", kind: "stringList" },
    {
      id: "regionStarts",
      label: "Region starts",
      kind: "numberList",
      description:
        "Zero-based half-open interval starts; coverage overlaps are unioned.",
    },
    { id: "regionEnds", label: "Region ends", kind: "numberList" },
    { id: "coveredStarts", label: "Covered starts", kind: "numberList" },
    { id: "coveredEnds", label: "Covered ends", kind: "numberList" },
  ],
  outputs: [
    { id: "coveredBases", label: "Covered bases", kind: "numberList" },
    { id: "coveragePercent", label: "Coverage percent", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      regionNames: value.regionNames as readonly string[],
      regionStarts: value.regionStarts as readonly number[],
      regionEnds: value.regionEnds as readonly number[],
      coveredStarts: value.coveredStarts as readonly number[],
      coveredEnds: value.coveredEnds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
