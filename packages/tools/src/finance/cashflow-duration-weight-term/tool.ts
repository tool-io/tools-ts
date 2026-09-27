import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentValue: number;
  readonly totalPresentValue: number;
  readonly timeYears: number;
};
export type Output = {
  readonly valueWeight: number;
  readonly durationContributionYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentValue: { type: "number" },
    totalPresentValue: { type: "number" },
    timeYears: { type: "number" },
  },
  required: ["presentValue", "totalPresentValue", "timeYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valueWeight: { type: "number" },
    durationContributionYears: { type: "number" },
  },
  required: ["valueWeight", "durationContributionYears"],
} as const;
/** One supplied signed discounted cash-flow contribution to value-weighted duration; no yield curve or portfolio valuation is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentValue, totalPresentValue, timeYears } = request;
  const compute = (): Output => {
    H.domain(totalPresentValue !== 0);
    return {
      valueWeight: presentValue / totalPresentValue,
      durationContributionYears: (timeYears * presentValue) / totalPresentValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentValue: 80, totalPresentValue: 200, timeYears: 3 },
  output: { valueWeight: 0.4, durationContributionYears: 1.2 },
} satisfies ToolExample<Input, Output>;
export const cashflowDurationWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/cashflow-duration-weight-term",
    title: "Cashflow Duration Weight Term Tool",
    description:
      "One supplied signed discounted cash-flow contribution to value-weighted duration; no yield curve or portfolio valuation is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentValue: { type: "number" },
        totalPresentValue: { type: "number" },
        timeYears: { type: "number" },
      },
      required: ["presentValue", "totalPresentValue", "timeYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valueWeight: { type: "number" },
        durationContributionYears: { type: "number" },
      },
      required: ["valueWeight", "durationContributionYears"],
    },
    ports: {
      inputs: [
        {
          id: "presentValue",
          label: "Present Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPresentValue",
          label: "Total Present Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeYears",
          label: "Time Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "valueWeight",
          label: "Value Weight",
          valueType: { type: "number" },
        },
        {
          id: "durationContributionYears",
          label: "Duration Contribution Years",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cashflowDurationWeightTermTool.execute;
export default cashflowDurationWeightTermTool;
