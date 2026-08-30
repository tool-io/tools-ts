import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly proceeds: number;
  readonly adjustedBasis: number;
  readonly collectiblesRatePercent: number;
}>;
export type Output = Readonly<{
  readonly taxableGain: number;
  readonly estimatedTax: number;
}>;

export const calculate = (input: Input): Output => {
  const taxableGain = Math.max(0, input.proceeds - input.adjustedBasis);
  return {
    taxableGain,
    estimatedTax: (taxableGain * input.collectiblesRatePercent) / 100,
  };
};

export const exampleInput = {
  proceeds: 15000,
  adjustedBasis: 9000,
  collectiblesRatePercent: 28,
} satisfies Input;
export const exampleOutput = {
  taxableGain: 6000,
  estimatedTax: 1680,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      proceeds: input.proceeds as number,
      adjustedBasis: input.adjustedBasis as number,
      collectiblesRatePercent: input.collectiblesRatePercent as number,
    }),
  description:
    "Estimate tax on a positive collectible gain using a caller-supplied rate.",
  id: "taxation/collectibles-gain-tax",
  inputs: [
    {
      id: "proceeds",
      label: "Disposition proceeds",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "adjustedBasis",
      label: "Adjusted basis",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "collectiblesRatePercent",
      label: "Applicable collectibles rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "taxableGain",
      label: "Taxable gain",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "estimatedTax",
      label: "Estimated tax",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Collectibles Gain Tax",
});

export const run = tool.execute;
export default tool;
