import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseFee: number;
  readonly includedDays: number;
  readonly usageDays: number;
  readonly extraDailyRate: number;
};
export type Output = {
  readonly extraDays: number;
  readonly usageFee: number;
  readonly totalFee: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseFee: { type: "number", minimum: 0 },
    includedDays: { type: "number", minimum: 0 },
    usageDays: { type: "number", minimum: 0 },
    extraDailyRate: { type: "number", minimum: 0 },
  },
  required: ["baseFee", "includedDays", "usageDays", "extraDailyRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extraDays: { type: "number" },
    usageFee: { type: "number" },
    totalFee: { type: "number" },
  },
  required: ["extraDays", "usageFee", "totalFee"],
} as const;
/** Base fee is retained for shorter usage; only days beyond the explicit included period add charges. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseFee, includedDays, usageDays, extraDailyRate } = request;
  const compute = (): Output => {
    H.domain(
      baseFee >= 0 &&
        includedDays >= 0 &&
        usageDays >= 0 &&
        extraDailyRate >= 0,
    );
    return {
      extraDays: Math.max(0, usageDays - includedDays),
      usageFee: Math.max(0, usageDays - includedDays) * extraDailyRate,
      totalFee:
        baseFee + Math.max(0, usageDays - includedDays) * extraDailyRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseFee: 500, includedDays: 30, usageDays: 45, extraDailyRate: 10 },
  output: { extraDays: 15, usageFee: 150, totalFee: 650 },
} satisfies ToolExample<Input, Output>;
export const influencerFeeUsagePeriodProrationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/influencer-fee-usage-period-proration",
    title: "Influencer Fee Usage Period Proration Tool",
    description:
      "Base fee is retained for shorter usage; only days beyond the explicit included period add charges.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseFee: { type: "number", minimum: 0 },
        includedDays: { type: "number", minimum: 0 },
        usageDays: { type: "number", minimum: 0 },
        extraDailyRate: { type: "number", minimum: 0 },
      },
      required: ["baseFee", "includedDays", "usageDays", "extraDailyRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extraDays: { type: "number" },
        usageFee: { type: "number" },
        totalFee: { type: "number" },
      },
      required: ["extraDays", "usageFee", "totalFee"],
    },
    ports: {
      inputs: [
        {
          id: "baseFee",
          label: "Base Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includedDays",
          label: "Included Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usageDays",
          label: "Usage Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extraDailyRate",
          label: "Extra Daily Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "extraDays", label: "Extra Days", valueType: { type: "number" } },
        { id: "usageFee", label: "Usage Fee", valueType: { type: "number" } },
        { id: "totalFee", label: "Total Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = influencerFeeUsagePeriodProrationTool.execute;
export default influencerFeeUsagePeriodProrationTool;
