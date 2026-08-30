import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly timeBinsNanoseconds: readonly number[];
  readonly photonCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanLifetimeNanoseconds: number;
  readonly totalPhotonCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.timeBinsNanoseconds.length === 0 ||
    input.timeBinsNanoseconds.length !== input.photonCounts.length ||
    input.photonCounts.some((value) => value < 0)
  )
    simpleError(
      "timeBinsNanoseconds",
      "Time bins and nonnegative counts must be aligned and nonempty.",
      "invalid_histogram",
    );
  const totalPhotonCount = input.photonCounts.reduce((a, b) => a + b, 0);
  if (totalPhotonCount <= 0)
    simpleError(
      "photonCounts",
      "Total photon count must be positive.",
      "zero_counts",
    );
  const meanLifetimeNanoseconds =
    input.timeBinsNanoseconds.reduce(
      (sum, value, index) => sum + value * input.photonCounts[index],
      0,
    ) / totalPhotonCount;
  return { meanLifetimeNanoseconds, totalPhotonCount };
};

export const exampleInput = {
  timeBinsNanoseconds: [1, 2, 3],
  photonCounts: [0, 2, 2],
} satisfies Input;
export const exampleOutput = {
  meanLifetimeNanoseconds: 2.5,
  totalPhotonCount: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      timeBinsNanoseconds: input.timeBinsNanoseconds as readonly number[],
      photonCounts: input.photonCounts as readonly number[],
    }),
  description:
    "Calculate a count-weighted mean fluorescence lifetime from a supplied histogram.",
  id: "laser/flim-mean-lifetime",
  inputs: [
    {
      id: "timeBinsNanoseconds",
      label: "Lifetime time bins",
      kind: "numberList",
      unit: "ns",
    },
    { id: "photonCounts", label: "Photon counts", kind: "numberList" },
  ],
  outputs: [
    {
      id: "meanLifetimeNanoseconds",
      label: "Count-weighted mean lifetime",
      kind: "number",
      minimum: 0,
      unit: "ns",
    },
    {
      id: "totalPhotonCount",
      label: "Total photon count",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "FLIM Mean Lifetime",
});

export const run = tool.execute;
export default tool;
