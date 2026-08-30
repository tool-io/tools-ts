import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly alleleOneMethylated: number;
  readonly alleleOneTotal: number;
  readonly alleleTwoMethylated: number;
  readonly alleleTwoTotal: number;
  readonly minimumDifferencePoints: number;
}>;
export type Output = Readonly<{
  readonly absoluteDifferencePoints: number;
  readonly coupled: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.alleleOneMethylated > input.alleleOneTotal ||
    input.alleleTwoMethylated > input.alleleTwoTotal
  )
    simpleError(
      "alleleOneMethylated",
      "Methylated reads cannot exceed totals.",
      "invalid_counts",
    );
  const a = (input.alleleOneMethylated / input.alleleOneTotal) * 100,
    b = (input.alleleTwoMethylated / input.alleleTwoTotal) * 100,
    absoluteDifferencePoints = Math.abs(a - b);
  return {
    absoluteDifferencePoints,
    coupled: absoluteDifferencePoints >= input.minimumDifferencePoints,
  };
};

export const exampleInput = {
  alleleOneMethylated: 80,
  alleleOneTotal: 100,
  alleleTwoMethylated: 20,
  alleleTwoTotal: 100,
  minimumDifferencePoints: 40,
} satisfies Input;
export const exampleOutput = {
  absoluteDifferencePoints: 60,
  coupled: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      alleleOneMethylated: input.alleleOneMethylated as number,
      alleleOneTotal: input.alleleOneTotal as number,
      alleleTwoMethylated: input.alleleTwoMethylated as number,
      alleleTwoTotal: input.alleleTwoTotal as number,
      minimumDifferencePoints: input.minimumDifferencePoints as number,
    }),
  description: "Detect allele-specific methylation from phased read counts.",
  id: "epigenetics/allele-methylation-coupling",
  inputs: [
    {
      id: "alleleOneMethylated",
      label: "Allele-one methylated reads",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "alleleOneTotal",
      label: "Allele-one total reads",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "alleleTwoMethylated",
      label: "Allele-two methylated reads",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "alleleTwoTotal",
      label: "Allele-two total reads",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "minimumDifferencePoints",
      label: "Minimum difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "absoluteDifferencePoints",
      label: "Absolute methylation difference",
      kind: "number",
      minimum: 0,
    },
    {
      id: "coupled",
      label: "Allele-specific coupling detected",
      kind: "boolean",
    },
  ],
  title: "Allele–Methylation Coupling",
});

export const run = tool.execute;
export default tool;
