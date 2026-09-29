import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEnd: number;
  readonly nextStart: number;
  readonly cleaningDuration: number;
  readonly resetDuration: number;
};
export type Output = {
  readonly availableDuration: number;
  readonly requiredDuration: number;
  readonly slack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEnd: { type: "number" },
    nextStart: { type: "number" },
    cleaningDuration: { type: "number", minimum: 0 },
    resetDuration: { type: "number", minimum: 0 },
  },
  required: ["previousEnd", "nextStart", "cleaningDuration", "resetDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableDuration: { type: "number" },
    requiredDuration: { type: "number" },
    slack: { type: "number" },
  },
  required: ["availableDuration", "requiredDuration", "slack"],
} as const;
/** Calculate event seat turnover window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEnd, nextStart, cleaningDuration, resetDuration } = request;
  const compute = (): Output => {
    H.domain(cleaningDuration >= 0 && resetDuration >= 0);
    return {
      availableDuration: nextStart - previousEnd,
      requiredDuration: cleaningDuration + resetDuration,
      slack: nextStart - previousEnd - cleaningDuration - resetDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousEnd: 10,
    nextStart: 15,
    cleaningDuration: 2,
    resetDuration: 1,
  },
  output: { availableDuration: 5, requiredDuration: 3, slack: 2 },
} satisfies ToolExample<Input, Output>;
export const eventSeatTurnoverWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/event-seat-turnover-window-gap",
    title: "Event Seat Turnover Window Gap Tool",
    description:
      "Calculate event seat turnover window gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEnd: { type: "number" },
        nextStart: { type: "number" },
        cleaningDuration: { type: "number", minimum: 0 },
        resetDuration: { type: "number", minimum: 0 },
      },
      required: [
        "previousEnd",
        "nextStart",
        "cleaningDuration",
        "resetDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableDuration: { type: "number" },
        requiredDuration: { type: "number" },
        slack: { type: "number" },
      },
      required: ["availableDuration", "requiredDuration", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "previousEnd",
          label: "Previous End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cleaningDuration",
          label: "Cleaning Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resetDuration",
          label: "Reset Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableDuration",
          label: "Available Duration",
          valueType: { type: "number" },
        },
        {
          id: "requiredDuration",
          label: "Required Duration",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eventSeatTurnoverWindowGapTool.execute;
export default eventSeatTurnoverWindowGapTool;
