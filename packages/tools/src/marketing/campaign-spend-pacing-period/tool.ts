import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spentAmount: number;
  readonly totalBudget: number;
  readonly elapsedPeriod: number;
  readonly totalPeriod: number;
};
export type Output = {
  readonly spendFraction: number;
  readonly elapsedFraction: number;
  readonly pacingDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spentAmount: { type: "number", minimum: 0 },
    totalBudget: { type: "number", exclusiveMinimum: 0 },
    elapsedPeriod: { type: "number", minimum: 0 },
    totalPeriod: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spentAmount", "totalBudget", "elapsedPeriod", "totalPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spendFraction: { type: "number" },
    elapsedFraction: { type: "number" },
    pacingDifference: { type: "number" },
  },
  required: ["spendFraction", "elapsedFraction", "pacingDifference"],
} as const;
/** Compare explicit campaign spend share with elapsed-period share without predicting spend or results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spentAmount, totalBudget, elapsedPeriod, totalPeriod } = request;
  const compute = (): Output => {
    H.domain(spentAmount >= 0, "spentAmount");
    (H.domain(Number.isFinite(totalBudget) && totalBudget > 0, "totalBudget"),
      totalBudget);
    (H.domain(Number.isFinite(totalPeriod) && totalPeriod > 0, "totalPeriod"),
      totalPeriod);
    H.domain(
      elapsedPeriod >= 0 && elapsedPeriod <= totalPeriod,
      "elapsedPeriod",
    );
    return {
      spendFraction: spentAmount / totalBudget,
      elapsedFraction: elapsedPeriod / totalPeriod,
      pacingDifference: spentAmount / totalBudget - elapsedPeriod / totalPeriod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spentAmount: 600,
    totalBudget: 1000,
    elapsedPeriod: 5,
    totalPeriod: 10,
  },
  output: {
    spendFraction: 0.6,
    elapsedFraction: 0.5,
    pacingDifference: 0.09999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const campaignSpendPacingPeriodTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["marketing", "business and finance"],
      keywords: ["marketing", "business and finance"],
    },
    id: "marketing/campaign-spend-pacing-period",
    title: "Campaign Spend Pacing Period",
    description:
      "Compare explicit campaign spend share with elapsed-period share without predicting spend or results.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spentAmount: { type: "number", minimum: 0 },
        totalBudget: { type: "number", exclusiveMinimum: 0 },
        elapsedPeriod: { type: "number", minimum: 0 },
        totalPeriod: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spentAmount", "totalBudget", "elapsedPeriod", "totalPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spendFraction: { type: "number" },
        elapsedFraction: { type: "number" },
        pacingDifference: { type: "number" },
      },
      required: ["spendFraction", "elapsedFraction", "pacingDifference"],
    },
    ports: {
      inputs: [
        {
          id: "spentAmount",
          label: "Spent Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBudget",
          label: "Total Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedPeriod",
          label: "Elapsed Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPeriod",
          label: "Total Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "spendFraction",
          label: "Spend Fraction",
          valueType: { type: "number" },
        },
        {
          id: "elapsedFraction",
          label: "Elapsed Fraction",
          valueType: { type: "number" },
        },
        {
          id: "pacingDifference",
          label: "Pacing Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = campaignSpendPacingPeriodTool.execute;
export default campaignSpendPacingPeriodTool;
