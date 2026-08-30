import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly estateReportedBasis: number;
  readonly heirClaimedBasis: number;
  readonly toleranceAmount: number;
}>;
export type Output = Readonly<{
  readonly basisDifference: number;
  readonly absoluteDifference: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  const basisDifference = input.heirClaimedBasis - input.estateReportedBasis;
  return {
    basisDifference,
    absoluteDifference: Math.abs(basisDifference),
    withinTolerance: Math.abs(basisDifference) <= input.toleranceAmount,
  };
};

export const exampleInput = {
  estateReportedBasis: 100,
  heirClaimedBasis: 105,
  toleranceAmount: 10,
} satisfies Input;
export const exampleOutput = {
  basisDifference: 5,
  absoluteDifference: 5,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      estateReportedBasis: input.estateReportedBasis as number,
      heirClaimedBasis: input.heirClaimedBasis as number,
      toleranceAmount: input.toleranceAmount as number,
    }),
  description:
    "Compare estate-reported and heir-claimed basis within a supplied tolerance.",
  id: "taxation/heir-basis-consistency",
  inputs: [
    {
      id: "estateReportedBasis",
      label: "Estate-reported basis",
      kind: "number",
      minimum: 0,
    },
    {
      id: "heirClaimedBasis",
      label: "Heir-claimed basis",
      kind: "number",
      minimum: 0,
    },
    {
      id: "toleranceAmount",
      label: "Allowed difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "basisDifference",
      label: "Claimed minus reported basis",
      kind: "number",
    },
    {
      id: "absoluteDifference",
      label: "Absolute basis difference",
      kind: "number",
      minimum: 0,
    },
    {
      id: "withinTolerance",
      label: "Within supplied tolerance",
      kind: "boolean",
    },
  ],
  title: "Heir Basis Consistency",
});

export const run = tool.execute;
export default tool;
