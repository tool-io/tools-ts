import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly recordingStart: number;
  readonly recordingEnd: number;
};
export type Output = {
  readonly retainedStart: number;
  readonly retainedEnd: number;
  readonly retainedDuration: number;
  readonly leadingTruncation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
    recordingStart: { type: "number" },
    recordingEnd: { type: "number" },
  },
  required: ["windowStart", "windowEnd", "recordingStart", "recordingEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedStart: { type: "number" },
    retainedEnd: { type: "number" },
    retainedDuration: { type: "number" },
    leadingTruncation: { type: "number" },
  },
  required: [
    "retainedStart",
    "retainedEnd",
    "retainedDuration",
    "leadingTruncation",
  ],
} as const;
/** Resolve a supplied research response window clipped to an overlapping recording interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowStart, windowEnd, recordingStart, recordingEnd } = request;
  const compute = (): Output => {
    H.domain(
      windowStart <= windowEnd &&
        recordingStart <= recordingEnd &&
        Math.max(windowStart, recordingStart) <=
          Math.min(windowEnd, recordingEnd),
    );
    return {
      retainedStart: Math.max(windowStart, recordingStart),
      retainedEnd: Math.min(windowEnd, recordingEnd),
      retainedDuration:
        Math.min(windowEnd, recordingEnd) -
        Math.max(windowStart, recordingStart),
      leadingTruncation: Math.max(0, recordingStart - windowStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    windowStart: 0,
    windowEnd: 100,
    recordingStart: 20,
    recordingEnd: 80,
  },
  output: {
    retainedStart: 20,
    retainedEnd: 80,
    retainedDuration: 60,
    leadingTruncation: 20,
  },
} satisfies ToolExample<Input, Output>;
export const responseWindowTruncationOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/response-window-truncation-offset",
    title: "Response Window Truncation Offset Tool",
    description:
      "Resolve a supplied research response window clipped to an overlapping recording interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
        recordingStart: { type: "number" },
        recordingEnd: { type: "number" },
      },
      required: ["windowStart", "windowEnd", "recordingStart", "recordingEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedStart: { type: "number" },
        retainedEnd: { type: "number" },
        retainedDuration: { type: "number" },
        leadingTruncation: { type: "number" },
      },
      required: [
        "retainedStart",
        "retainedEnd",
        "retainedDuration",
        "leadingTruncation",
      ],
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
          id: "recordingStart",
          label: "Recording Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordingEnd",
          label: "Recording End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedStart",
          label: "Retained Start",
          valueType: { type: "number" },
        },
        {
          id: "retainedEnd",
          label: "Retained End",
          valueType: { type: "number" },
        },
        {
          id: "retainedDuration",
          label: "Retained Duration",
          valueType: { type: "number" },
        },
        {
          id: "leadingTruncation",
          label: "Leading Truncation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = responseWindowTruncationOffsetTool.execute;
export default responseWindowTruncationOffsetTool;
