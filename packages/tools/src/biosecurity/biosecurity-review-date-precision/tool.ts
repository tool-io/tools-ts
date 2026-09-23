import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reviewLower: number;
  readonly reviewUpper: number;
  readonly dueDay: number;
};
export type Output = {
  readonly slackLower: number;
  readonly slackUpper: number;
  readonly certainlyBeforeDue: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reviewLower: { type: "integer" },
    reviewUpper: { type: "integer" },
    dueDay: { type: "integer" },
  },
  required: ["reviewLower", "reviewUpper", "dueDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slackLower: { type: "integer" },
    slackUpper: { type: "integer" },
    certainlyBeforeDue: { type: "boolean" },
  },
  required: ["slackLower", "slackUpper", "certainlyBeforeDue"],
} as const;
/** Compare supplied administrative review date bounds without selecting security policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewLower, reviewUpper, dueDay } = request;
  const compute = (): Output => {
    H.domain(reviewLower <= reviewUpper);
    return {
      slackLower: dueDay - reviewUpper,
      slackUpper: dueDay - reviewLower,
      certainlyBeforeDue: reviewUpper < dueDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reviewLower: 100, reviewUpper: 105, dueDay: 110 },
  output: { slackLower: 5, slackUpper: 10, certainlyBeforeDue: true },
} satisfies ToolExample<Input, Output>;
export const biosecurityReviewDatePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/biosecurity-review-date-precision",
    title: "Biosecurity Review Date Precision Tool",
    description:
      "Compare supplied administrative review date bounds without selecting security policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reviewLower: { type: "integer" },
        reviewUpper: { type: "integer" },
        dueDay: { type: "integer" },
      },
      required: ["reviewLower", "reviewUpper", "dueDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slackLower: { type: "integer" },
        slackUpper: { type: "integer" },
        certainlyBeforeDue: { type: "boolean" },
      },
      required: ["slackLower", "slackUpper", "certainlyBeforeDue"],
    },
    ports: {
      inputs: [
        {
          id: "reviewLower",
          label: "Review Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reviewUpper",
          label: "Review Upper",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dueDay",
          label: "Due Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "slackLower",
          label: "Slack Lower",
          valueType: { type: "integer" },
        },
        {
          id: "slackUpper",
          label: "Slack Upper",
          valueType: { type: "integer" },
        },
        {
          id: "certainlyBeforeDue",
          label: "Certainly Before Due",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosecurityReviewDatePrecisionTool.execute;
export default biosecurityReviewDatePrecisionTool;
