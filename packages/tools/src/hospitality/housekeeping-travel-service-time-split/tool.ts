import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rooms: number;
  readonly minutesPerRoom: number;
  readonly travelMinutes: number;
  readonly breakMinutes: number;
  readonly shiftMinutes: number;
};
export type Output = {
  readonly serviceMinutes: number;
  readonly totalMinutes: number;
  readonly remainingMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rooms: { type: "integer", minimum: 0 },
    minutesPerRoom: { type: "number", minimum: 0 },
    travelMinutes: { type: "number", minimum: 0 },
    breakMinutes: { type: "number", minimum: 0 },
    shiftMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "rooms",
    "minutesPerRoom",
    "travelMinutes",
    "breakMinutes",
    "shiftMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceMinutes: { type: "number" },
    totalMinutes: { type: "number" },
    remainingMinutes: { type: "number" },
  },
  required: ["serviceMinutes", "totalMinutes", "remainingMinutes"],
} as const;
/** Calculate housekeeping travel service time split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rooms, minutesPerRoom, travelMinutes, breakMinutes, shiftMinutes } =
    request;
  const compute = (): Output => {
    H.integer(rooms, 0);
    H.domain(
      minutesPerRoom >= 0 &&
        travelMinutes >= 0 &&
        breakMinutes >= 0 &&
        shiftMinutes >= 0,
    );
    return {
      serviceMinutes: rooms * minutesPerRoom,
      totalMinutes: rooms * minutesPerRoom + travelMinutes + breakMinutes,
      remainingMinutes:
        shiftMinutes - rooms * minutesPerRoom - travelMinutes - breakMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rooms: 10,
    minutesPerRoom: 20,
    travelMinutes: 30,
    breakMinutes: 30,
    shiftMinutes: 300,
  },
  output: { serviceMinutes: 200, totalMinutes: 260, remainingMinutes: 40 },
} satisfies ToolExample<Input, Output>;
export const housekeepingTravelServiceTimeSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/housekeeping-travel-service-time-split",
    title: "Housekeeping Travel Service Time Split Tool",
    description:
      "Calculate housekeeping travel service time split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rooms: { type: "integer", minimum: 0 },
        minutesPerRoom: { type: "number", minimum: 0 },
        travelMinutes: { type: "number", minimum: 0 },
        breakMinutes: { type: "number", minimum: 0 },
        shiftMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "rooms",
        "minutesPerRoom",
        "travelMinutes",
        "breakMinutes",
        "shiftMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceMinutes: { type: "number" },
        totalMinutes: { type: "number" },
        remainingMinutes: { type: "number" },
      },
      required: ["serviceMinutes", "totalMinutes", "remainingMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "rooms",
          label: "Rooms",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minutesPerRoom",
          label: "Minutes Per Room",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelMinutes",
          label: "Travel Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breakMinutes",
          label: "Break Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shiftMinutes",
          label: "Shift Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "serviceMinutes",
          label: "Service Minutes",
          valueType: { type: "number" },
        },
        {
          id: "totalMinutes",
          label: "Total Minutes",
          valueType: { type: "number" },
        },
        {
          id: "remainingMinutes",
          label: "Remaining Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = housekeepingTravelServiceTimeSplitTool.execute;
export default housekeepingTravelServiceTimeSplitTool;
