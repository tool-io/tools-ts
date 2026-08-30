import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly modeledOccurrenceLosses: readonly number[];
  readonly aggregateCorrelationFactor: number;
  readonly portfolioLimit: number;
}>;
export type Output = Readonly<{
  readonly largestOccurrenceLoss: number;
  readonly modeledAggregatePml: number;
  readonly limitedAggregatePml: number;
  readonly limitHeadroom: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.modeledOccurrenceLosses.length === 0 ||
    input.modeledOccurrenceLosses.some((value) => value < 0)
  )
    simpleError(
      "modeledOccurrenceLosses",
      "Losses must be nonempty and nonnegative.",
      "invalid_losses",
    );
  const largestOccurrenceLoss = Math.max(...input.modeledOccurrenceLosses),
    modeledAggregatePml =
      input.modeledOccurrenceLosses.reduce((a, b) => a + b, 0) *
      input.aggregateCorrelationFactor,
    limitedAggregatePml = Math.min(input.portfolioLimit, modeledAggregatePml);
  return {
    largestOccurrenceLoss,
    modeledAggregatePml,
    limitedAggregatePml,
    limitHeadroom: input.portfolioLimit - limitedAggregatePml,
  };
};

export const exampleInput = {
  modeledOccurrenceLosses: [100, 200, 300],
  aggregateCorrelationFactor: 0.5,
  portfolioLimit: 400,
} satisfies Input;
export const exampleOutput = {
  largestOccurrenceLoss: 300,
  modeledAggregatePml: 300,
  limitedAggregatePml: 300,
  limitHeadroom: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      modeledOccurrenceLosses:
        input.modeledOccurrenceLosses as readonly number[],
      aggregateCorrelationFactor: input.aggregateCorrelationFactor as number,
      portfolioLimit: input.portfolioLimit as number,
    }),
  description:
    "Aggregate modeled occurrence losses into a caller-parameterized PML.",
  id: "insurance/pml-aggregation",
  inputs: [
    {
      id: "modeledOccurrenceLosses",
      label: "Modeled occurrence losses",
      kind: "numberList",
    },
    {
      id: "aggregateCorrelationFactor",
      label: "Aggregate correlation factor",
      kind: "number",
      minimum: 0,
    },
    {
      id: "portfolioLimit",
      label: "Portfolio limit",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "largestOccurrenceLoss",
      label: "Largest occurrence loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "modeledAggregatePml",
      label: "Modeled aggregate PML",
      kind: "number",
      minimum: 0,
    },
    {
      id: "limitedAggregatePml",
      label: "Aggregate PML after limit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "limitHeadroom",
      label: "Portfolio-limit headroom",
      kind: "number",
      unit: "currency",
    },
  ],
  title: "PML Aggregation",
});

export const run = tool.execute;
export default tool;
