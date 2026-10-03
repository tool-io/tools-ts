import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventOpenedAt: number;
  readonly firstReviewAt: number;
  readonly latestReviewAt: number;
  readonly suppliedReviewInterval: number;
};
export type Output = {
  readonly firstReviewLag: number;
  readonly latestReviewLag: number;
  readonly intervalMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventOpenedAt: { type: "number" },
    firstReviewAt: { type: "number" },
    latestReviewAt: { type: "number" },
    suppliedReviewInterval: { type: "number", minimum: 0 },
  },
  required: [
    "eventOpenedAt",
    "firstReviewAt",
    "latestReviewAt",
    "suppliedReviewInterval",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstReviewLag: { type: "number" },
    latestReviewLag: { type: "number" },
    intervalMargin: { type: "number" },
  },
  required: ["firstReviewLag", "latestReviewLag", "intervalMargin"],
} as const;
/** Calculate quality event review gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    eventOpenedAt,
    firstReviewAt,
    latestReviewAt,
    suppliedReviewInterval,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstReviewAt >= eventOpenedAt &&
        latestReviewAt >= firstReviewAt &&
        suppliedReviewInterval >= 0,
    );
    return {
      firstReviewLag: firstReviewAt - eventOpenedAt,
      latestReviewLag: latestReviewAt - firstReviewAt,
      intervalMargin: suppliedReviewInterval - (latestReviewAt - firstReviewAt),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventOpenedAt: 0,
    firstReviewAt: 2,
    latestReviewAt: 8,
    suppliedReviewInterval: 5,
  },
  output: { firstReviewLag: 2, latestReviewLag: 6, intervalMargin: -1 },
} satisfies ToolExample<Input, Output>;
export const qualityEventReviewGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/quality-event-review-gap",
    title: "Quality Event Review Gap Tool",
    description:
      "Calculate quality event review gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventOpenedAt: { type: "number" },
        firstReviewAt: { type: "number" },
        latestReviewAt: { type: "number" },
        suppliedReviewInterval: { type: "number", minimum: 0 },
      },
      required: [
        "eventOpenedAt",
        "firstReviewAt",
        "latestReviewAt",
        "suppliedReviewInterval",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstReviewLag: { type: "number" },
        latestReviewLag: { type: "number" },
        intervalMargin: { type: "number" },
      },
      required: ["firstReviewLag", "latestReviewLag", "intervalMargin"],
    },
    ports: {
      inputs: [
        {
          id: "eventOpenedAt",
          label: "Event Opened At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstReviewAt",
          label: "First Review At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestReviewAt",
          label: "Latest Review At",
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
        {
          id: "firstReviewLag",
          label: "First Review Lag",
          valueType: { type: "number" },
        },
        {
          id: "latestReviewLag",
          label: "Latest Review Lag",
          valueType: { type: "number" },
        },
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
export const run = qualityEventReviewGapTool.execute;
export default qualityEventReviewGapTool;
