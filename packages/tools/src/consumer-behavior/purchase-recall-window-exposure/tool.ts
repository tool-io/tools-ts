import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly recallStart: number;
  readonly recallEnd: number;
};
export type Output = {
  readonly overlapDuration: number;
  readonly windowShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
    recallStart: { type: "number" },
    recallEnd: { type: "number" },
  },
  required: ["windowStart", "windowEnd", "recallStart", "recallEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDuration: { type: "number" },
    windowShare: { type: "number" },
  },
  required: ["overlapDuration", "windowShare"],
} as const;
/** Measure supplied half-open recall/window overlap without imputing remembered purchases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowStart, windowEnd, recallStart, recallEnd } = request;
  const compute = (): Output => {
    H.domain(windowStart < windowEnd && recallStart <= recallEnd);
    return {
      overlapDuration: Math.max(
        0,
        Math.min(windowEnd, recallEnd) - Math.max(windowStart, recallStart),
      ),
      windowShare:
        Math.max(
          0,
          Math.min(windowEnd, recallEnd) - Math.max(windowStart, recallStart),
        ) /
        (windowEnd - windowStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { windowStart: 0, windowEnd: 100, recallStart: 20, recallEnd: 80 },
  output: { overlapDuration: 60, windowShare: 0.6 },
} satisfies ToolExample<Input, Output>;
export const purchaseRecallWindowExposureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/purchase-recall-window-exposure",
    title: "Purchase Recall Window Exposure Tool",
    description:
      "Measure supplied half-open recall/window overlap without imputing remembered purchases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
        recallStart: { type: "number" },
        recallEnd: { type: "number" },
      },
      required: ["windowStart", "windowEnd", "recallStart", "recallEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDuration: { type: "number" },
        windowShare: { type: "number" },
      },
      required: ["overlapDuration", "windowShare"],
    },
    ports: {
      inputs: [
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recallStart",
          label: "Recall Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recallEnd",
          label: "Recall End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
        {
          id: "windowShare",
          label: "Window Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = purchaseRecallWindowExposureTool.execute;
export default purchaseRecallWindowExposureTool;
