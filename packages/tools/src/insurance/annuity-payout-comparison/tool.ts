import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly periodCertainMonthlyPayment: number;
  readonly periodCertainMonths: number;
  readonly lifeMonthlyPayment: number;
  readonly assumedLifeMonths: number;
}>;
export type Output = Readonly<{
  readonly periodCertainTotal: number;
  readonly assumedLifeTotal: number;
  readonly higherProjectedTotal: string;
}>;

export const calculate = (input: Input): Output => {
  const periodCertainTotal =
    input.periodCertainMonthlyPayment * input.periodCertainMonths;
  const assumedLifeTotal = input.lifeMonthlyPayment * input.assumedLifeMonths;
  return {
    periodCertainTotal,
    assumedLifeTotal,
    higherProjectedTotal:
      periodCertainTotal === assumedLifeTotal
        ? "tie"
        : periodCertainTotal > assumedLifeTotal
          ? "period-certain"
          : "life",
  };
};

export const exampleInput = {
  periodCertainMonthlyPayment: 1000,
  periodCertainMonths: 120,
  lifeMonthlyPayment: 800,
  assumedLifeMonths: 180,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  periodCertainMonthlyPayment: 1000,
  periodCertainMonths: 120,
  lifeMonthlyPayment: 1000,
  assumedLifeMonths: 120,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      periodCertainMonthlyPayment: input.periodCertainMonthlyPayment as number,
      periodCertainMonths: input.periodCertainMonths as number,
      lifeMonthlyPayment: input.lifeMonthlyPayment as number,
      assumedLifeMonths: input.assumedLifeMonths as number,
    }),
  description: "Compare nominal payout totals under caller-supplied durations.",
  id: "insurance/annuity-payout-comparison",
  inputs: [
    {
      id: "periodCertainMonthlyPayment",
      label: "Period-certain monthly payment",
      kind: "number",
      minimum: 0,
      unit: "currency/month",
    },
    {
      id: "periodCertainMonths",
      label: "Period-certain months",
      kind: "integer",
      minimum: 1,
      unit: "months",
    },
    {
      id: "lifeMonthlyPayment",
      label: "Life monthly payment",
      kind: "number",
      minimum: 0,
      unit: "currency/month",
    },
    {
      id: "assumedLifeMonths",
      label: "Assumed life-payment months",
      kind: "integer",
      minimum: 1,
      unit: "months",
    },
  ],
  outputs: [
    {
      id: "periodCertainTotal",
      label: "Period-certain total",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "assumedLifeTotal",
      label: "Assumed life total",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "higherProjectedTotal",
      label: "Higher projected total",
      kind: "string",
      enum: ["period-certain", "life", "tie"],
    },
  ],
  title: "Annuity Payout Comparison",
});

export const run = tool.execute;
export default tool;
