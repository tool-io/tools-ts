import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly faceValue: number;
  readonly annualDiscountRatePercent: number;
  readonly daysToMaturity: number;
  readonly dayCountBasis: number;
}>;
export type Output = Readonly<{
  readonly discountAmount: number;
  readonly proceeds: number;
}>;

export const calculate = (input: Input): Output => {
  const discountAmount =
    input.faceValue *
    (input.annualDiscountRatePercent / 100) *
    (input.daysToMaturity / input.dayCountBasis);
  const proceeds = input.faceValue - discountAmount;
  if (proceeds < 0)
    simpleError(
      "annualDiscountRatePercent",
      "Discount exceeds face value.",
      "negative_proceeds",
    );
  return { discountAmount, proceeds };
};

export const exampleInput = {
  faceValue: 100000,
  annualDiscountRatePercent: 6,
  daysToMaturity: 90,
  dayCountBasis: 360,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  faceValue: 1000,
  annualDiscountRatePercent: 0,
  daysToMaturity: 30,
  dayCountBasis: 360,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      faceValue: input.faceValue as number,
      annualDiscountRatePercent: input.annualDiscountRatePercent as number,
      daysToMaturity: input.daysToMaturity as number,
      dayCountBasis: input.dayCountBasis as number,
    }),
  description:
    "Calculate simple banker's-acceptance discount and proceeds with an explicit day-count basis.",
  id: "banking/bankers-acceptance-discount",
  inputs: [
    {
      id: "faceValue",
      label: "Face value",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "annualDiscountRatePercent",
      label: "Annual discount rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "daysToMaturity",
      label: "Days to maturity",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "dayCountBasis",
      label: "Day-count basis",
      kind: "integer",
      minimum: 1,
      unit: "days",
    },
  ],
  outputs: [
    {
      id: "discountAmount",
      label: "Discount amount",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "proceeds",
      label: "Discounted proceeds",
      kind: "number",
      unit: "currency",
    },
  ],
  title: "Banker's Acceptance Discount",
});

export const run = tool.execute;
export default tool;
