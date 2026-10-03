import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actionClosed: number;
  readonly reviewTime: number;
  readonly suppliedMinimumInterval: number;
};
export type Output = {
  readonly elapsed: number;
  readonly intervalMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actionClosed: { type: "number" },
    reviewTime: { type: "number" },
    suppliedMinimumInterval: { type: "number", minimum: 0 },
  },
  required: ["actionClosed", "reviewTime", "suppliedMinimumInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    intervalMargin: { type: "number" },
  },
  required: ["elapsed", "intervalMargin"],
} as const;
/** Inspect supplied CAPA review scheduling metadata without determining effectiveness or compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actionClosed, reviewTime, suppliedMinimumInterval } = request;
  const compute = (): Output => {
    H.domain(suppliedMinimumInterval >= 0);
    return {
      elapsed: reviewTime - actionClosed,
      intervalMargin: reviewTime - actionClosed - suppliedMinimumInterval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actionClosed: 100, reviewTime: 130, suppliedMinimumInterval: 20 },
  output: { elapsed: 30, intervalMargin: 10 },
} satisfies ToolExample<Input, Output>;
export const capaEffectivenessReviewGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/capa-effectiveness-review-gap",
    title: "CAPA Effectiveness Review Gap Tool",
    description:
      "Inspect supplied CAPA review scheduling metadata without determining effectiveness or compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actionClosed: { type: "number" },
        reviewTime: { type: "number" },
        suppliedMinimumInterval: { type: "number", minimum: 0 },
      },
      required: ["actionClosed", "reviewTime", "suppliedMinimumInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        intervalMargin: { type: "number" },
      },
      required: ["elapsed", "intervalMargin"],
    },
    ports: {
      inputs: [
        {
          id: "actionClosed",
          label: "Action Closed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reviewTime",
          label: "Review Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMinimumInterval",
          label: "Supplied Minimum Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "intervalMargin",
          label: "Interval Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capaEffectivenessReviewGapTool.execute;
export default capaEffectivenessReviewGapTool;
