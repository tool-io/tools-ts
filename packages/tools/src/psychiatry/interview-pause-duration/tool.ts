import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly pauseDurations: readonly number[];
};
export type Output = {
  readonly elapsed: number;
  readonly activeDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    pauseDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["start", "end", "pauseDurations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    activeDuration: { type: "number" },
  },
  required: ["elapsed", "activeDuration"],
} as const;
/** Calculate interview pause duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, pauseDurations } = request;
  const compute = (): Output => {
    H.domain(
      end >= start &&
        pauseDurations.every((x) => x >= 0) &&
        pauseDurations.reduce((a, b) => a + b, 0) <= end - start,
    );
    return {
      elapsed: end - start,
      activeDuration: end - start - pauseDurations.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, end: 40, pauseDurations: [5, 3] },
  output: { elapsed: 30, activeDuration: 22 },
} satisfies ToolExample<Input, Output>;
export const interviewPauseDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/interview-pause-duration",
    title: "Interview Pause Duration Tool",
    description:
      "Calculate interview pause duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        end: { type: "number" },
        pauseDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["start", "end", "pauseDurations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        activeDuration: { type: "number" },
      },
      required: ["elapsed", "activeDuration"],
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
          id: "pauseDurations",
          label: "Pause Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = interviewPauseDurationTool.execute;
export default interviewPauseDurationTool;
