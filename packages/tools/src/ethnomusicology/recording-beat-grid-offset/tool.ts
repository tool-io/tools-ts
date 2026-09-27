import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventSeconds: number;
  readonly gridOriginSeconds: number;
  readonly secondsPerBeat: number;
};
export type Output = {
  readonly beatCoordinate: number;
  readonly nearestBeat: number;
  readonly offsetSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventSeconds: { type: "number" },
    gridOriginSeconds: { type: "number" },
    secondsPerBeat: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eventSeconds", "gridOriginSeconds", "secondsPerBeat"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beatCoordinate: { type: "number" },
    nearestBeat: { type: "integer" },
    offsetSeconds: { type: "number" },
  },
  required: ["beatCoordinate", "nearestBeat", "offsetSeconds"],
} as const;
/** Locate a supplied event on a fixed beat grid using nearest ties toward positive infinity; no beat detection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventSeconds, gridOriginSeconds, secondsPerBeat } = request;
  const compute = (): Output => {
    H.positive(secondsPerBeat);
    return {
      beatCoordinate: (eventSeconds - gridOriginSeconds) / secondsPerBeat,
      nearestBeat: Math.round(
        (eventSeconds - gridOriginSeconds) / secondsPerBeat,
      ),
      offsetSeconds:
        eventSeconds -
        gridOriginSeconds -
        Math.round((eventSeconds - gridOriginSeconds) / secondsPerBeat) *
          secondsPerBeat,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventSeconds: 1.1, gridOriginSeconds: 0, secondsPerBeat: 0.5 },
  output: {
    beatCoordinate: 2.2,
    nearestBeat: 2,
    offsetSeconds: 0.10000000000000009,
  },
} satisfies ToolExample<Input, Output>;
export const recordingBeatGridOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/recording-beat-grid-offset",
    title: "Recording Beat Grid Offset Tool",
    description:
      "Locate a supplied event on a fixed beat grid using nearest ties toward positive infinity; no beat detection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventSeconds: { type: "number" },
        gridOriginSeconds: { type: "number" },
        secondsPerBeat: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eventSeconds", "gridOriginSeconds", "secondsPerBeat"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beatCoordinate: { type: "number" },
        nearestBeat: { type: "integer" },
        offsetSeconds: { type: "number" },
      },
      required: ["beatCoordinate", "nearestBeat", "offsetSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "eventSeconds",
          label: "Event Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridOriginSeconds",
          label: "Grid Origin Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondsPerBeat",
          label: "Seconds Per Beat",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "beatCoordinate",
          label: "Beat Coordinate",
          valueType: { type: "number" },
        },
        {
          id: "nearestBeat",
          label: "Nearest Beat",
          valueType: { type: "integer" },
        },
        {
          id: "offsetSeconds",
          label: "Offset Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recordingBeatGridOffsetTool.execute;
export default recordingBeatGridOffsetTool;
