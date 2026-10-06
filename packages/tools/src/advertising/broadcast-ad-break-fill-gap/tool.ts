import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly breakDurationSeconds: number;
  readonly bookedDurationSeconds: number;
};
export type Output = {
  readonly unfilledSeconds: number;
  readonly overbookedSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    breakDurationSeconds: { type: "number", minimum: 0 },
    bookedDurationSeconds: { type: "number", minimum: 0 },
  },
  required: ["breakDurationSeconds", "bookedDurationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unfilledSeconds: { type: "number" },
    overbookedSeconds: { type: "number" },
  },
  required: ["unfilledSeconds", "overbookedSeconds"],
} as const;
/** Compare explicit broadcast break and booked durations without scheduling or transmitting advertising. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { breakDurationSeconds, bookedDurationSeconds } = request;
  const compute = (): Output => {
    H.domain(
      breakDurationSeconds >= 0 && bookedDurationSeconds >= 0,
      "breakDurationSeconds",
    );
    return {
      unfilledSeconds: Math.max(
        0,
        breakDurationSeconds - bookedDurationSeconds,
      ),
      overbookedSeconds: Math.max(
        0,
        bookedDurationSeconds - breakDurationSeconds,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { breakDurationSeconds: 180, bookedDurationSeconds: 150 },
  output: { unfilledSeconds: 30, overbookedSeconds: 0 },
} satisfies ToolExample<Input, Output>;
export const broadcastAdBreakFillGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["advertising", "business and finance"],
      keywords: ["advertising", "business and finance"],
    },
    id: "advertising/broadcast-ad-break-fill-gap",
    title: "Broadcast Ad Break Fill Gap",
    description:
      "Compare explicit broadcast break and booked durations without scheduling or transmitting advertising.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        breakDurationSeconds: { type: "number", minimum: 0 },
        bookedDurationSeconds: { type: "number", minimum: 0 },
      },
      required: ["breakDurationSeconds", "bookedDurationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unfilledSeconds: { type: "number" },
        overbookedSeconds: { type: "number" },
      },
      required: ["unfilledSeconds", "overbookedSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "breakDurationSeconds",
          label: "Break Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bookedDurationSeconds",
          label: "Booked Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unfilledSeconds",
          label: "Unfilled Seconds",
          valueType: { type: "number" },
        },
        {
          id: "overbookedSeconds",
          label: "Overbooked Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = broadcastAdBreakFillGapTool.execute;
export default broadcastAdBreakFillGapTool;
