import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstViews: number;
  readonly firstConversions: number;
  readonly secondViews: number;
  readonly secondConversions: number;
  readonly absoluteZThreshold: number;
}>;
export type Output = Readonly<{
  readonly firstConversionPercent: number;
  readonly secondConversionPercent: number;
  readonly liftPercent: number;
  readonly zScore: number;
  readonly meetsThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.firstConversions > input.firstViews ||
    input.secondConversions > input.secondViews
  )
    simpleError(
      "firstConversions",
      "Conversions cannot exceed views.",
      "invalid_counts",
    );
  const firstRate = input.firstConversions / input.firstViews;
  const secondRate = input.secondConversions / input.secondViews;
  const pooledRate =
    (input.firstConversions + input.secondConversions) /
    (input.firstViews + input.secondViews);
  const standardError = Math.sqrt(
    pooledRate *
      (1 - pooledRate) *
      (1 / input.firstViews + 1 / input.secondViews),
  );
  const zScore =
    standardError === 0 ? 0 : (secondRate - firstRate) / standardError;
  if (firstRate === 0 && secondRate > 0)
    simpleError(
      "firstConversions",
      "Relative lift is undefined when the first conversion rate is zero.",
      "zero_baseline",
    );
  const liftPercent = firstRate === 0 ? 0 : (secondRate / firstRate - 1) * 100;
  return {
    firstConversionPercent: firstRate * 100,
    secondConversionPercent: secondRate * 100,
    liftPercent,
    zScore,
    meetsThreshold: Math.abs(zScore) >= input.absoluteZThreshold,
  };
};

export const exampleInput = {
  firstViews: 1000,
  firstConversions: 100,
  secondViews: 1000,
  secondConversions: 130,
  absoluteZThreshold: 1.96,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  firstViews: 10,
  firstConversions: 0,
  secondViews: 10,
  secondConversions: 0,
  absoluteZThreshold: 1.96,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstViews: input.firstViews as number,
      firstConversions: input.firstConversions as number,
      secondViews: input.secondViews as number,
      secondConversions: input.secondConversions as number,
      absoluteZThreshold: input.absoluteZThreshold as number,
    }),
  description:
    "Calculate conversion lift and a pooled two-proportion z-score for two headlines.",
  id: "journalism/headline-ab-significance",
  inputs: [
    {
      id: "firstViews",
      label: "First headline views",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "firstConversions",
      label: "First headline conversions",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "secondViews",
      label: "Second headline views",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "secondConversions",
      label: "Second headline conversions",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "absoluteZThreshold",
      label: "Absolute z-score threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "firstConversionPercent",
      label: "First conversion rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "secondConversionPercent",
      label: "Second conversion rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "liftPercent", label: "Relative lift", kind: "number", unit: "%" },
    { id: "zScore", label: "Two-proportion z-score", kind: "number" },
    { id: "meetsThreshold", label: "Meets z-score threshold", kind: "boolean" },
  ],
  title: "Headline A/B Significance",
});

export const run = tool.execute;
export default tool;
