import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly maternalExpression: number;
  readonly paternalExpression: number;
  readonly minorThresholdPercent: number;
}>;
export type Output = Readonly<{
  readonly minorAllelePercent: number;
  readonly lossOfImprinting: boolean;
}>;

export const calculate = (input: Input): Output => {
  const total = input.maternalExpression + input.paternalExpression;
  if (total <= 0)
    simpleError(
      "maternalExpression",
      "Total expression must be positive.",
      "zero_expression",
    );
  const minorAllelePercent =
    (Math.min(input.maternalExpression, input.paternalExpression) / total) *
    100;
  return {
    minorAllelePercent,
    lossOfImprinting: minorAllelePercent >= input.minorThresholdPercent,
  };
};

export const exampleInput = {
  maternalExpression: 80,
  paternalExpression: 20,
  minorThresholdPercent: 15,
} satisfies Input;
export const exampleOutput = {
  minorAllelePercent: 20,
  lossOfImprinting: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      maternalExpression: input.maternalExpression as number,
      paternalExpression: input.paternalExpression as number,
      minorThresholdPercent: input.minorThresholdPercent as number,
    }),
  description: "Flag loss of imprinting from biallelic expression.",
  id: "epigenetics/imprinting-loss",
  inputs: [
    {
      id: "maternalExpression",
      label: "Maternal expression",
      kind: "number",
      minimum: 0,
    },
    {
      id: "paternalExpression",
      label: "Paternal expression",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minorThresholdPercent",
      label: "Minor allele threshold",
      kind: "number",
      minimum: 0,
      maximum: 50,
    },
  ],
  outputs: [
    {
      id: "minorAllelePercent",
      label: "Minor allele share",
      kind: "number",
      minimum: 0,
      maximum: 50,
    },
    { id: "lossOfImprinting", label: "Loss of imprinting", kind: "boolean" },
  ],
  title: "Imprinting Loss",
});

export const run = tool.execute;
export default tool;
