import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskDurations: readonly number[];
  readonly sampledDurations: readonly number[];
  readonly taskRequired: readonly boolean[];
};
export type Output = {
  readonly requiredDuration: number;
  readonly sampledRequiredDuration: number;
  readonly unsampledRequiredDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskDurations: { type: "array", maxItems: 256, items: { type: "number" } },
    sampledDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    taskRequired: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["taskDurations", "sampledDurations", "taskRequired"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredDuration: { type: "number" },
    sampledRequiredDuration: { type: "number" },
    unsampledRequiredDuration: { type: "number" },
  },
  required: [
    "requiredDuration",
    "sampledRequiredDuration",
    "unsampledRequiredDuration",
  ],
} as const;
/** Calculate shift task sampling gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskDurations, sampledDurations, taskRequired } = request;
  const compute = (): Output => {
    H.sameLength(taskDurations, sampledDurations);
    H.sameLength(taskDurations, taskRequired);
    H.domain(
      taskDurations.every(
        (x, i) =>
          x >= 0 && sampledDurations[i] >= 0 && sampledDurations[i] <= x,
      ),
    );
    return (() => {
      const requiredDuration = taskDurations.reduce(
          (s, x, i) => s + (taskRequired[i] ? x : 0),
          0,
        ),
        sampledRequiredDuration = sampledDurations.reduce(
          (s, x, i) => s + (taskRequired[i] ? x : 0),
          0,
        );
      return {
        requiredDuration,
        sampledRequiredDuration,
        unsampledRequiredDuration: requiredDuration - sampledRequiredDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskDurations: [5, 5, 10],
    sampledDurations: [2, 4, 0],
    taskRequired: [true, true, false],
  },
  output: {
    requiredDuration: 10,
    sampledRequiredDuration: 6,
    unsampledRequiredDuration: 4,
  },
} satisfies ToolExample<Input, Output>;
export const shiftTaskSamplingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/shift-task-sampling-gap",
    title: "Shift Task Sampling Gap Tool",
    description:
      "Calculate shift task sampling gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sampledDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        taskRequired: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["taskDurations", "sampledDurations", "taskRequired"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredDuration: { type: "number" },
        sampledRequiredDuration: { type: "number" },
        unsampledRequiredDuration: { type: "number" },
      },
      required: [
        "requiredDuration",
        "sampledRequiredDuration",
        "unsampledRequiredDuration",
      ],
    },
    ports: {
      inputs: [
        {
          id: "taskDurations",
          label: "Task Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sampledDurations",
          label: "Sampled Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "taskRequired",
          label: "Task Required",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "requiredDuration",
          label: "Required Duration",
          valueType: { type: "number" },
        },
        {
          id: "sampledRequiredDuration",
          label: "Sampled Required Duration",
          valueType: { type: "number" },
        },
        {
          id: "unsampledRequiredDuration",
          label: "Unsampled Required Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shiftTaskSamplingGapTool.execute;
export default shiftTaskSamplingGapTool;
