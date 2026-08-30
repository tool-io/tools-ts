import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly bAlleleFrequencies: readonly number[];
  readonly minimumDeviation: number;
  readonly minimumRun: number;
}>;
export type Output = Readonly<{
  readonly longestRun: number;
  readonly updFlag: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.bAlleleFrequencies.length === 0 ||
    input.bAlleleFrequencies.some((v) => v < 0 || v > 1)
  )
    simpleError(
      "bAlleleFrequencies",
      "BAF values must be between zero and one.",
      "invalid_baf",
    );
  let run = 0,
    longestRun = 0;
  for (const v of input.bAlleleFrequencies) {
    run = Math.abs(v - 0.5) >= input.minimumDeviation ? run + 1 : 0;
    longestRun = Math.max(longestRun, run);
  }
  return { longestRun, updFlag: longestRun >= input.minimumRun };
};

export const exampleInput = {
  bAlleleFrequencies: [0.1, 0.15, 0.2, 0.5],
  minimumDeviation: 0.25,
  minimumRun: 3,
} satisfies Input;
export const exampleOutput = { longestRun: 3, updFlag: true } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      bAlleleFrequencies: input.bAlleleFrequencies as readonly number[],
      minimumDeviation: input.minimumDeviation as number,
      minimumRun: input.minimumRun as number,
    }),
  description: "Screen B-allele frequencies for a UPD-like segment.",
  id: "epigenetics/upd-segment-screen",
  inputs: [
    {
      id: "bAlleleFrequencies",
      label: "B-allele frequencies",
      kind: "numberList",
    },
    {
      id: "minimumDeviation",
      label: "Minimum deviation",
      kind: "number",
      minimum: 0,
      maximum: 0.5,
    },
    {
      id: "minimumRun",
      label: "Minimum marker run",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "longestRun",
      label: "Longest deviant run",
      kind: "integer",
      minimum: 0,
    },
    { id: "updFlag", label: "UPD segment flag", kind: "boolean" },
  ],
  title: "UPD Segment Screen",
});

export const run = tool.execute;
export default tool;
