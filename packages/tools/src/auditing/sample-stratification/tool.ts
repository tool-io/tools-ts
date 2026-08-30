import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly itemValues: readonly number[];
  readonly largeThreshold: number;
  readonly mediumThreshold: number;
}>;
export type Output = Readonly<{
  readonly largeCount: number;
  readonly mediumCount: number;
  readonly smallCount: number;
  readonly largeValueSharePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.mediumThreshold > input.largeThreshold ||
    input.itemValues.length === 0 ||
    input.itemValues.some((value) => value < 0)
  )
    simpleError(
      "mediumThreshold",
      "Thresholds must be ordered and values nonnegative.",
      "invalid_strata",
    );
  const large = input.itemValues.filter(
      (value) => value >= input.largeThreshold,
    ),
    medium = input.itemValues.filter(
      (value) => value >= input.mediumThreshold && value < input.largeThreshold,
    ),
    small = input.itemValues.filter((value) => value < input.mediumThreshold),
    total = input.itemValues.reduce((a, b) => a + b, 0);
  return {
    largeCount: large.length,
    mediumCount: medium.length,
    smallCount: small.length,
    largeValueSharePercent:
      total === 0 ? 0 : (large.reduce((a, b) => a + b, 0) / total) * 100,
  };
};

export const exampleInput = {
  itemValues: [1000, 500, 100, 50],
  largeThreshold: 800,
  mediumThreshold: 200,
} satisfies Input;
export const exampleOutput = {
  largeCount: 1,
  mediumCount: 1,
  smallCount: 2,
  largeValueSharePercent: 60.60606060606061,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      itemValues: input.itemValues as readonly number[],
      largeThreshold: input.largeThreshold as number,
      mediumThreshold: input.mediumThreshold as number,
    }),
  description: "Stratify population items into caller-supplied value bands.",
  id: "auditing/sample-stratification",
  inputs: [
    { id: "itemValues", label: "Population item values", kind: "numberList" },
    {
      id: "largeThreshold",
      label: "Large-item threshold",
      kind: "number",
      minimum: 0,
    },
    {
      id: "mediumThreshold",
      label: "Medium-item threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "largeCount",
      label: "Large item count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "mediumCount",
      label: "Medium item count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "smallCount",
      label: "Small item count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "largeValueSharePercent",
      label: "Large-item value share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Sample Stratification",
});

export const run = tool.execute;
export default tool;
