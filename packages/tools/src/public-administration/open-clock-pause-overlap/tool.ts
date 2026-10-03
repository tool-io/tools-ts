import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clockStart: number;
  readonly clockEnd: number;
  readonly pauseStart: number;
  readonly pauseEnd: number;
};
export type Output = {
  readonly grossDuration: number;
  readonly pausedInside: number;
  readonly runningDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clockStart: { type: "number" },
    clockEnd: { type: "number" },
    pauseStart: { type: "number" },
    pauseEnd: { type: "number" },
  },
  required: ["clockStart", "clockEnd", "pauseStart", "pauseEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossDuration: { type: "number" },
    pausedInside: { type: "number" },
    runningDuration: { type: "number" },
  },
  required: ["grossDuration", "pausedInside", "runningDuration"],
} as const;
/** Subtract only an explicit pause’s overlap with a half-open administrative clock window. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clockStart, clockEnd, pauseStart, pauseEnd } = request;
  const compute = (): Output => {
    H.domain(clockEnd >= clockStart && pauseEnd >= pauseStart);
    return (() => {
      const pausedInside = Math.max(
          0,
          Math.min(clockEnd, pauseEnd) - Math.max(clockStart, pauseStart),
        ),
        grossDuration = clockEnd - clockStart;
      return {
        grossDuration,
        pausedInside,
        runningDuration: grossDuration - pausedInside,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clockStart: 0, clockEnd: 10, pauseStart: 8, pauseEnd: 15 },
  output: { grossDuration: 10, pausedInside: 2, runningDuration: 8 },
} satisfies ToolExample<Input, Output>;
export const openClockPauseOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/open-clock-pause-overlap",
    title: "Open Clock Pause Overlap Tool",
    description:
      "Subtract only an explicit pause’s overlap with a half-open administrative clock window.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clockStart: { type: "number" },
        clockEnd: { type: "number" },
        pauseStart: { type: "number" },
        pauseEnd: { type: "number" },
      },
      required: ["clockStart", "clockEnd", "pauseStart", "pauseEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossDuration: { type: "number" },
        pausedInside: { type: "number" },
        runningDuration: { type: "number" },
      },
      required: ["grossDuration", "pausedInside", "runningDuration"],
    },
    ports: {
      inputs: [
        {
          id: "clockStart",
          label: "Clock Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockEnd",
          label: "Clock End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseStart",
          label: "Pause Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseEnd",
          label: "Pause End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossDuration",
          label: "Gross Duration",
          valueType: { type: "number" },
        },
        {
          id: "pausedInside",
          label: "Paused Inside",
          valueType: { type: "number" },
        },
        {
          id: "runningDuration",
          label: "Running Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = openClockPauseOverlapTool.execute;
export default openClockPauseOverlapTool;
