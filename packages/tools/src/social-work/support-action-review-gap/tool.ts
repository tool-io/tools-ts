import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actionAt: number;
  readonly reviewAt: number;
  readonly suppliedReviewInterval: number;
};
export type Output = { readonly elapsed: number; readonly dueMargin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actionAt: { type: "number" },
    reviewAt: { type: "number" },
    suppliedReviewInterval: { type: "number", minimum: 0 },
  },
  required: ["actionAt", "reviewAt", "suppliedReviewInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, dueMargin: { type: "number" } },
  required: ["elapsed", "dueMargin"],
} as const;
/** Compare supplied action and review clocks against an explicit interval; no service policy is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actionAt, reviewAt, suppliedReviewInterval } = request;
  const compute = (): Output => {
    H.domain(reviewAt >= actionAt && suppliedReviewInterval >= 0);
    return {
      elapsed: reviewAt - actionAt,
      dueMargin: suppliedReviewInterval - (reviewAt - actionAt),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actionAt: 10, reviewAt: 16, suppliedReviewInterval: 5 },
  output: { elapsed: 6, dueMargin: -1 },
} satisfies ToolExample<Input, Output>;
export const supportActionReviewGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/support-action-review-gap",
    title: "Support Action Review Gap Tool",
    description:
      "Compare supplied action and review clocks against an explicit interval; no service policy is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actionAt: { type: "number" },
        reviewAt: { type: "number" },
        suppliedReviewInterval: { type: "number", minimum: 0 },
      },
      required: ["actionAt", "reviewAt", "suppliedReviewInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        dueMargin: { type: "number" },
      },
      required: ["elapsed", "dueMargin"],
    },
    ports: {
      inputs: [
        {
          id: "actionAt",
          label: "Action At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reviewAt",
          label: "Review At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReviewInterval",
          label: "Supplied Review Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "dueMargin", label: "Due Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = supportActionReviewGapTool.execute;
export default supportActionReviewGapTool;
