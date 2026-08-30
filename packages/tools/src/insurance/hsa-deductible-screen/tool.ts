import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly deductible: number;
  readonly minimumDeductible: number;
  readonly outOfPocketMaximum: number;
  readonly maximumOutOfPocket: number;
}>;
export type Output = Readonly<{
  readonly deductibleMeetsMinimum: boolean;
  readonly outOfPocketWithinMaximum: boolean;
  readonly meetsCallerThresholds: boolean;
}>;

export const calculate = (input: Input): Output => {
  const deductibleMeetsMinimum = input.deductible >= input.minimumDeductible;
  const outOfPocketWithinMaximum =
    input.outOfPocketMaximum <= input.maximumOutOfPocket;
  return {
    deductibleMeetsMinimum,
    outOfPocketWithinMaximum,
    meetsCallerThresholds: deductibleMeetsMinimum && outOfPocketWithinMaximum,
  };
};

export const exampleInput = {
  deductible: 1800,
  minimumDeductible: 1600,
  outOfPocketMaximum: 8000,
  maximumOutOfPocket: 8050,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  deductible: 1500,
  minimumDeductible: 1600,
  outOfPocketMaximum: 8000,
  maximumOutOfPocket: 8050,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      deductible: input.deductible as number,
      minimumDeductible: input.minimumDeductible as number,
      outOfPocketMaximum: input.outOfPocketMaximum as number,
      maximumOutOfPocket: input.maximumOutOfPocket as number,
    }),
  description: "Compare plan figures with caller-supplied HSA thresholds.",
  id: "insurance/hsa-deductible-screen",
  inputs: [
    {
      id: "deductible",
      label: "Plan deductible",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "minimumDeductible",
      label: "Minimum deductible",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "outOfPocketMaximum",
      label: "Plan out-of-pocket maximum",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "maximumOutOfPocket",
      label: "Maximum out-of-pocket",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "deductibleMeetsMinimum",
      label: "Deductible meets minimum",
      kind: "boolean",
    },
    {
      id: "outOfPocketWithinMaximum",
      label: "Out-of-pocket within maximum",
      kind: "boolean",
    },
    {
      id: "meetsCallerThresholds",
      label: "Meets caller thresholds",
      kind: "boolean",
    },
  ],
  title: "HSA Deductible Screen",
});

export const run = tool.execute;
export default tool;
