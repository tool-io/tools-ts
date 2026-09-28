import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskDurations: readonly number[];
  readonly scheduled: readonly boolean[];
  readonly observed: readonly boolean[];
  readonly valid: readonly boolean[];
};
export type Output = {
  readonly scheduledDuration: number;
  readonly validObservedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    scheduled: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["taskDurations", "scheduled", "observed", "valid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledDuration: { type: "number" },
    validObservedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["scheduledDuration", "validObservedDuration", "share", "defined"],
} as const;
/** Calculate function observation valid share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskDurations, scheduled, observed, valid } = request;
  const compute = (): Output => {
    H.sameLength(taskDurations, scheduled);
    H.sameLength(taskDurations, observed);
    H.sameLength(taskDurations, valid);
    H.domain(taskDurations.every((x) => x >= 0));
    return (() => {
      const scheduledDuration = taskDurations.reduce(
          (s, x, i) => s + (scheduled[i] ? x : 0),
          0,
        ),
        validObservedDuration = taskDurations.reduce(
          (s, x, i) => s + (scheduled[i] && observed[i] && valid[i] ? x : 0),
          0,
        );
      return {
        scheduledDuration,
        validObservedDuration,
        share:
          scheduledDuration > 0 ? validObservedDuration / scheduledDuration : 0,
        defined: scheduledDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskDurations: [2, 3, 5],
    scheduled: [true, true, false],
    observed: [true, true, true],
    valid: [true, false, true],
  },
  output: {
    scheduledDuration: 5,
    validObservedDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const functionObservationValidShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/function-observation-valid-share",
    title: "Function Observation Valid Share Tool",
    description:
      "Calculate function observation valid share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        scheduled: { type: "array", maxItems: 256, items: { type: "boolean" } },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["taskDurations", "scheduled", "observed", "valid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledDuration: { type: "number" },
        validObservedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "scheduledDuration",
        "validObservedDuration",
        "share",
        "defined",
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
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "scheduledDuration",
          label: "Scheduled Duration",
          valueType: { type: "number" },
        },
        {
          id: "validObservedDuration",
          label: "Valid Observed Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = functionObservationValidShareTool.execute;
export default functionObservationValidShareTool;
