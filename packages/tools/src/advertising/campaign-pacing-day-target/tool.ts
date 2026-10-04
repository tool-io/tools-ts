import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly campaignBudget: number;
  readonly spentToDate: number;
  readonly remainingDays: number;
};
export type Output = {
  readonly remainingBudget: number;
  readonly dailyTarget: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    campaignBudget: { type: "number", minimum: 0 },
    spentToDate: { type: "number", minimum: 0 },
    remainingDays: { type: "integer", minimum: 1 },
  },
  required: ["campaignBudget", "spentToDate", "remainingDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingBudget: { type: "number" },
    dailyTarget: { type: "number" },
  },
  required: ["remainingBudget", "dailyTarget"],
} as const;
/** Allocate unspent campaign budget evenly over an explicit positive number of remaining days. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { campaignBudget, spentToDate, remainingDays } = request;
  const compute = (): Output => {
    H.domain(
      campaignBudget >= 0 && spentToDate >= 0 && spentToDate <= campaignBudget,
      "campaignBudget",
    );
    (H.domain(
      Number.isSafeInteger(remainingDays) &&
        remainingDays >= 1 &&
        remainingDays <= Number.MAX_SAFE_INTEGER,
      "remainingDays",
    ),
      remainingDays);
    return {
      remainingBudget: campaignBudget - spentToDate,
      dailyTarget: (campaignBudget - spentToDate) / remainingDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { campaignBudget: 1000, spentToDate: 400, remainingDays: 3 },
  output: { remainingBudget: 600, dailyTarget: 200 },
} satisfies ToolExample<Input, Output>;
export const campaignPacingDayTargetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/campaign-pacing-day-target",
    title: "Campaign Pacing Day Target Tool",
    description:
      "Allocate unspent campaign budget evenly over an explicit positive number of remaining days.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        campaignBudget: { type: "number", minimum: 0 },
        spentToDate: { type: "number", minimum: 0 },
        remainingDays: { type: "integer", minimum: 1 },
      },
      required: ["campaignBudget", "spentToDate", "remainingDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingBudget: { type: "number" },
        dailyTarget: { type: "number" },
      },
      required: ["remainingBudget", "dailyTarget"],
    },
    ports: {
      inputs: [
        {
          id: "campaignBudget",
          label: "Campaign Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spentToDate",
          label: "Spent To Date",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingDays",
          label: "Remaining Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingBudget",
          label: "Remaining Budget",
          valueType: { type: "number" },
        },
        {
          id: "dailyTarget",
          label: "Daily Target",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = campaignPacingDayTargetTool.execute;
export default campaignPacingDayTargetTool;
