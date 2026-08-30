import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly profitableYears: number;
  readonly yearsObserved: number;
  readonly businesslikeRecords: boolean;
  readonly regularActivity: boolean;
}>;
export type Output = Readonly<{
  readonly profitYearFraction: number;
  readonly businessIndicatorCount: number;
  readonly classification: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.profitableYears > input.yearsObserved)
    simpleError(
      "profitableYears",
      "Profitable years cannot exceed observed years.",
      "invalid_years",
    );
  const profitYearFraction = input.profitableYears / input.yearsObserved;
  const businessIndicatorCount =
    (profitYearFraction >= 0.6 ? 1 : 0) +
    (input.businesslikeRecords ? 1 : 0) +
    (input.regularActivity ? 1 : 0);
  return {
    profitYearFraction,
    businessIndicatorCount,
    classification:
      businessIndicatorCount >= 3
        ? "business-like"
        : businessIndicatorCount <= 1
          ? "hobby-like"
          : "review",
  };
};

export const exampleInput = {
  profitableYears: 3,
  yearsObserved: 5,
  businesslikeRecords: true,
  regularActivity: true,
} satisfies Input;
export const exampleOutput = {
  profitYearFraction: 0.6,
  businessIndicatorCount: 3,
  classification: "business-like",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      profitableYears: input.profitableYears as number,
      yearsObserved: input.yearsObserved as number,
      businesslikeRecords: input.businesslikeRecords as boolean,
      regularActivity: input.regularActivity as boolean,
    }),
  description:
    "Screen caller-supplied mining activity indicators without making a tax-status determination.",
  id: "taxation/mining-activity-screen",
  inputs: [
    {
      id: "profitableYears",
      label: "Profitable years",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "yearsObserved",
      label: "Years observed",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "businesslikeRecords",
      label: "Businesslike records maintained",
      kind: "boolean",
    },
    {
      id: "regularActivity",
      label: "Activity conducted regularly",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "profitYearFraction",
      label: "Fraction of profitable years",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "businessIndicatorCount",
      label: "Business indicators",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "classification",
      label: "Activity screen result",
      kind: "string",
      enum: ["business-like", "hobby-like", "review"],
    },
  ],
  title: "Mining Activity Screen",
});

export const run = tool.execute;
export default tool;
