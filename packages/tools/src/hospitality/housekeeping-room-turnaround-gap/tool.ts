import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly checkoutMinute: number;
  readonly nextCheckinMinute: number;
  readonly cleaningMinutes: number;
};
export type Output = {
  readonly availableMinutes: number;
  readonly turnaroundMarginMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    checkoutMinute: { type: "integer", minimum: 0 },
    nextCheckinMinute: { type: "integer" },
    cleaningMinutes: { type: "number", minimum: 0 },
  },
  required: ["checkoutMinute", "nextCheckinMinute", "cleaningMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "integer" },
    turnaroundMarginMinutes: { type: "number" },
  },
  required: ["availableMinutes", "turnaroundMarginMinutes"],
} as const;
/** Compare one room's available turnover interval with an explicit cleaning duration on a shared minute timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { checkoutMinute, nextCheckinMinute, cleaningMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(checkoutMinute) &&
        checkoutMinute >= 0 &&
        checkoutMinute <= Number.MAX_SAFE_INTEGER,
      "checkoutMinute",
    ),
      checkoutMinute);
    (H.domain(
      Number.isSafeInteger(nextCheckinMinute) &&
        nextCheckinMinute >= checkoutMinute &&
        nextCheckinMinute <= Number.MAX_SAFE_INTEGER,
      "nextCheckinMinute",
    ),
      nextCheckinMinute);
    H.domain(cleaningMinutes >= 0, "cleaningMinutes");
    return {
      availableMinutes: nextCheckinMinute - checkoutMinute,
      turnaroundMarginMinutes:
        nextCheckinMinute - checkoutMinute - cleaningMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { checkoutMinute: 660, nextCheckinMinute: 900, cleaningMinutes: 180 },
  output: { availableMinutes: 240, turnaroundMarginMinutes: 60 },
} satisfies ToolExample<Input, Output>;
export const housekeepingRoomTurnaroundGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/housekeeping-room-turnaround-gap",
    title: "Housekeeping Room Turnaround Gap Tool",
    description:
      "Compare one room's available turnover interval with an explicit cleaning duration on a shared minute timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        checkoutMinute: { type: "integer", minimum: 0 },
        nextCheckinMinute: { type: "integer" },
        cleaningMinutes: { type: "number", minimum: 0 },
      },
      required: ["checkoutMinute", "nextCheckinMinute", "cleaningMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "integer" },
        turnaroundMarginMinutes: { type: "number" },
      },
      required: ["availableMinutes", "turnaroundMarginMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "checkoutMinute",
          label: "Checkout Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextCheckinMinute",
          label: "Next Checkin Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cleaningMinutes",
          label: "Cleaning Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          valueType: { type: "integer" },
        },
        {
          id: "turnaroundMarginMinutes",
          label: "Turnaround Margin Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = housekeepingRoomTurnaroundGapTool.execute;
export default housekeepingRoomTurnaroundGapTool;
