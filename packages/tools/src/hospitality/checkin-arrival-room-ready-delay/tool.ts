import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalMinute: number;
  readonly roomReadyMinute: number;
  readonly scheduledCheckinMinute: number;
};
export type Output = {
  readonly waitMinutes: number;
  readonly earlyArrivalMinutes: number;
  readonly lateReadyMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalMinute: { type: "number" },
    roomReadyMinute: { type: "number" },
    scheduledCheckinMinute: { type: "number" },
  },
  required: ["arrivalMinute", "roomReadyMinute", "scheduledCheckinMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waitMinutes: { type: "number" },
    earlyArrivalMinutes: { type: "number" },
    lateReadyMinutes: { type: "number" },
  },
  required: ["waitMinutes", "earlyArrivalMinutes", "lateReadyMinutes"],
} as const;
/** Calculate checkin arrival room ready delay from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalMinute, roomReadyMinute, scheduledCheckinMinute } = request;
  const compute = (): Output => {
    return {
      waitMinutes: Math.max(0, roomReadyMinute - arrivalMinute),
      earlyArrivalMinutes: Math.max(0, scheduledCheckinMinute - arrivalMinute),
      lateReadyMinutes: Math.max(0, roomReadyMinute - scheduledCheckinMinute),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    arrivalMinute: 800,
    roomReadyMinute: 900,
    scheduledCheckinMinute: 840,
  },
  output: { waitMinutes: 100, earlyArrivalMinutes: 40, lateReadyMinutes: 60 },
} satisfies ToolExample<Input, Output>;
export const checkinArrivalRoomReadyDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/checkin-arrival-room-ready-delay",
    title: "Checkin Arrival Room Ready Delay Tool",
    description:
      "Calculate checkin arrival room ready delay from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalMinute: { type: "number" },
        roomReadyMinute: { type: "number" },
        scheduledCheckinMinute: { type: "number" },
      },
      required: ["arrivalMinute", "roomReadyMinute", "scheduledCheckinMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waitMinutes: { type: "number" },
        earlyArrivalMinutes: { type: "number" },
        lateReadyMinutes: { type: "number" },
      },
      required: ["waitMinutes", "earlyArrivalMinutes", "lateReadyMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalMinute",
          label: "Arrival Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roomReadyMinute",
          label: "Room Ready Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scheduledCheckinMinute",
          label: "Scheduled Checkin Minute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waitMinutes",
          label: "Wait Minutes",
          valueType: { type: "number" },
        },
        {
          id: "earlyArrivalMinutes",
          label: "Early Arrival Minutes",
          valueType: { type: "number" },
        },
        {
          id: "lateReadyMinutes",
          label: "Late Ready Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = checkinArrivalRoomReadyDelayTool.execute;
export default checkinArrivalRoomReadyDelayTool;
