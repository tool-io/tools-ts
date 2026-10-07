import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previouslySubscribed: boolean;
  readonly activePreviousPeriod: boolean;
  readonly activeCurrentPeriod: boolean;
};
export type Output = { readonly reactivated: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previouslySubscribed: { type: "boolean" },
    activePreviousPeriod: { type: "boolean" },
    activeCurrentPeriod: { type: "boolean" },
  },
  required: [
    "previouslySubscribed",
    "activePreviousPeriod",
    "activeCurrentPeriod",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reactivated: { type: "boolean" } },
  required: ["reactivated"],
} as const;
/** Identify reactivation under explicit previous-subscription and adjacent-period activity flags without confusing it with a first subscription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previouslySubscribed, activePreviousPeriod, activeCurrentPeriod } =
    request;
  const compute = (): Output => {
    H.domain(
      !activePreviousPeriod || previouslySubscribed,
      "activePreviousPeriod",
    );
    return {
      reactivated:
        previouslySubscribed && !activePreviousPeriod && activeCurrentPeriod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previouslySubscribed: true,
    activePreviousPeriod: false,
    activeCurrentPeriod: true,
  },
  output: { reactivated: true },
} satisfies ToolExample<Input, Output>;
export const subscriptionRevenueReactivationTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/subscription-revenue-reactivation-tag",
    title: "Subscription Revenue Reactivation Tag",
    description:
      "Identify reactivation under explicit previous-subscription and adjacent-period activity flags without confusing it with a first subscription.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previouslySubscribed: { type: "boolean" },
        activePreviousPeriod: { type: "boolean" },
        activeCurrentPeriod: { type: "boolean" },
      },
      required: [
        "previouslySubscribed",
        "activePreviousPeriod",
        "activeCurrentPeriod",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reactivated: { type: "boolean" } },
      required: ["reactivated"],
    },
    ports: {
      inputs: [
        {
          id: "previouslySubscribed",
          label: "Previously Subscribed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "activePreviousPeriod",
          label: "Active Previous Period",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "activeCurrentPeriod",
          label: "Active Current Period",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reactivated",
          label: "Reactivated",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = subscriptionRevenueReactivationTagTool.execute;
export default subscriptionRevenueReactivationTagTool;
