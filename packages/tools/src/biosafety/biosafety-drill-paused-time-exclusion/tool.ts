import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly pauseMinutes: number;
  readonly concurrentPause: number;
};
export type Output = {
  readonly elapsed: number;
  readonly excluded: number;
  readonly active: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    pauseMinutes: { type: "number", minimum: 0 },
    concurrentPause: { type: "number", minimum: 0 },
  },
  required: ["start", "end", "pauseMinutes", "concurrentPause"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    excluded: { type: "number" },
    active: { type: "number" },
  },
  required: ["elapsed", "excluded", "active"],
} as const;
/** Calculate biosafety drill paused time exclusion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, pauseMinutes, concurrentPause } = request;
  const compute = (): Output => {
    H.domain(
      end >= start &&
        pauseMinutes >= 0 &&
        concurrentPause >= 0 &&
        concurrentPause <= pauseMinutes &&
        pauseMinutes - concurrentPause <= end - start,
    );
    return {
      elapsed: end - start,
      excluded: pauseMinutes - concurrentPause,
      active: end - start - pauseMinutes + concurrentPause,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 0, end: 60, pauseMinutes: 15, concurrentPause: 5 },
  output: { elapsed: 60, excluded: 10, active: 50 },
} satisfies ToolExample<Input, Output>;
export const biosafetyDrillPausedTimeExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/biosafety-drill-paused-time-exclusion",
    title: "Biosafety Drill Paused Time Exclusion Tool",
    description:
      "Calculate biosafety drill paused time exclusion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        end: { type: "number" },
        pauseMinutes: { type: "number", minimum: 0 },
        concurrentPause: { type: "number", minimum: 0 },
      },
      required: ["start", "end", "pauseMinutes", "concurrentPause"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        excluded: { type: "number" },
        active: { type: "number" },
      },
      required: ["elapsed", "excluded", "active"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseMinutes",
          label: "Pause Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concurrentPause",
          label: "Concurrent Pause",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "excluded", label: "Excluded", valueType: { type: "number" } },
        { id: "active", label: "Active", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biosafetyDrillPausedTimeExclusionTool.execute;
export default biosafetyDrillPausedTimeExclusionTool;
