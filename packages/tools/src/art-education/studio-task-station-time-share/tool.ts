import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stationLabels: readonly string[];
  readonly taskDurations: readonly number[];
  readonly selectedStation: string;
  readonly availableTime: number;
};
export type Output = {
  readonly stationTime: number;
  readonly share: number;
  readonly totalTaskTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stationLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    taskDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    selectedStation: { type: "string", maxLength: 8192 },
    availableTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "stationLabels",
    "taskDurations",
    "selectedStation",
    "availableTime",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stationTime: { type: "number" },
    share: { type: "number" },
    totalTaskTime: { type: "number" },
  },
  required: ["stationTime", "share", "totalTaskTime"],
} as const;
/** Calculate studio task station time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stationLabels, taskDurations, selectedStation, availableTime } =
    request;
  const compute = (): Output => {
    H.sameLength(stationLabels, taskDurations);
    H.domain(taskDurations.every((x) => x >= 0));
    H.positive(availableTime);
    return (() => {
      const stationTime = taskDurations.reduce(
        (s, x, i) => s + (stationLabels[i] === selectedStation ? x : 0),
        0,
      );
      return {
        stationTime,
        share: stationTime / availableTime,
        totalTaskTime: taskDurations.reduce((a, b) => a + b, 0),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stationLabels: ["A", "B", "A"],
    taskDurations: [2, 3, 1],
    selectedStation: "A",
    availableTime: 10,
  },
  output: { stationTime: 3, share: 0.3, totalTaskTime: 6 },
} satisfies ToolExample<Input, Output>;
export const studioTaskStationTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/studio-task-station-time-share",
    title: "Studio Task Station Time Share Tool",
    description:
      "Calculate studio task station time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stationLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        taskDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        selectedStation: { type: "string", maxLength: 8192 },
        availableTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "stationLabels",
        "taskDurations",
        "selectedStation",
        "availableTime",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stationTime: { type: "number" },
        share: { type: "number" },
        totalTaskTime: { type: "number" },
      },
      required: ["stationTime", "share", "totalTaskTime"],
    },
    ports: {
      inputs: [
        {
          id: "stationLabels",
          label: "Station Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "taskDurations",
          label: "Task Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selectedStation",
          label: "Selected Station",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "availableTime",
          label: "Available Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stationTime",
          label: "Station Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "totalTaskTime",
          label: "Total Task Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = studioTaskStationTimeShareTool.execute;
export default studioTaskStationTimeShareTool;
