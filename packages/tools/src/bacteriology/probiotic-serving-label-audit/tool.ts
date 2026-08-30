import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly measuredCfuPerGram: number;
  readonly servingGrams: number;
  readonly retainedViabilityFraction: number;
  readonly labelCfuPerServing: number;
}>;
export type Output = Readonly<{
  readonly estimatedCfuPerServing: number;
  readonly labelCoverageFraction: number;
  readonly meetsLabelClaim: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.measuredCfuPerGram, "measuredCfuPerGram");
  positive(input.servingGrams, "servingGrams");
  fraction(input.retainedViabilityFraction, "retainedViabilityFraction");
  positive(input.labelCfuPerServing, "labelCfuPerServing");
  const estimatedCfuPerServing =
    input.measuredCfuPerGram *
    input.servingGrams *
    input.retainedViabilityFraction;
  return {
    estimatedCfuPerServing,
    labelCoverageFraction: estimatedCfuPerServing / input.labelCfuPerServing,
    meetsLabelClaim: estimatedCfuPerServing >= input.labelCfuPerServing,
  };
};
export const exampleInput = {
  measuredCfuPerGram: 1000000000,
  servingGrams: 2,
  retainedViabilityFraction: 0.8,
  labelCfuPerServing: 1000000000,
} satisfies Input;
export const exampleOutput = {
  estimatedCfuPerServing: 1600000000,
  labelCoverageFraction: 1.6,
  meetsLabelClaim: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/probiotic-serving-label-audit",
  title: "Probiotic Serving Label Audit",
  description:
    "Compare a serving CFU estimate with a label claim using measured concentration and caller-supplied viability retention.",
  inputs: [
    {
      id: "measuredCfuPerGram",
      label: "Measured cfu per gram",
      kind: "number",
      minimum: 0,
    },
    { id: "servingGrams", label: "Serving grams", kind: "number" },
    {
      id: "retainedViabilityFraction",
      label: "Retained viability fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "labelCfuPerServing",
      label: "Label cfu per serving",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "estimatedCfuPerServing",
      label: "Estimated cfu per serving",
      kind: "number",
    },
    {
      id: "labelCoverageFraction",
      label: "Label coverage fraction",
      kind: "number",
    },
    { id: "meetsLabelClaim", label: "Meets label claim", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      measuredCfuPerGram: value.measuredCfuPerGram as number,
      servingGrams: value.servingGrams as number,
      retainedViabilityFraction: value.retainedViabilityFraction as number,
      labelCfuPerServing: value.labelCfuPerServing as number,
    }),
});
export const run = tool.execute;
export default tool;
