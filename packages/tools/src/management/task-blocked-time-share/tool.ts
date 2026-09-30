import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedDurations: readonly number[];
  readonly blocked: readonly boolean[];
  readonly plannedDuration: number;
};
export type Output = {
  readonly blockedTime: number;
  readonly observedTime: number;
  readonly observedBlockedShare: number;
  readonly plannedBlockedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    blocked: { type: "array", maxItems: 256, items: { type: "boolean" } },
    plannedDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elapsedDurations", "blocked", "plannedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockedTime: { type: "number" },
    observedTime: { type: "number" },
    observedBlockedShare: { type: "number" },
    plannedBlockedShare: { type: "number" },
  },
  required: [
    "blockedTime",
    "observedTime",
    "observedBlockedShare",
    "plannedBlockedShare",
  ],
} as const;
/** Calculate task blocked time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedDurations, blocked, plannedDuration } = request;
  const compute = (): Output => {
    H.sameLength(elapsedDurations, blocked);
    H.domain(elapsedDurations.every((x) => x >= 0));
    H.positive(plannedDuration);
    return (() => {
      const observedTime = elapsedDurations.reduce((a, b) => a + b, 0),
        blockedTime = elapsedDurations.reduce(
          (s, x, i) => s + (blocked[i] ? x : 0),
          0,
        );
      H.positive(observedTime);
      return {
        blockedTime,
        observedTime,
        observedBlockedShare: blockedTime / observedTime,
        plannedBlockedShare: blockedTime / plannedDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsedDurations: [2, 3, 5],
    blocked: [true, false, true],
    plannedDuration: 20,
  },
  output: {
    blockedTime: 7,
    observedTime: 10,
    observedBlockedShare: 0.7,
    plannedBlockedShare: 0.35,
  },
} satisfies ToolExample<Input, Output>;
export const taskBlockedTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/task-blocked-time-share",
    title: "Task Blocked Time Share Tool",
    description:
      "Calculate task blocked time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        blocked: { type: "array", maxItems: 256, items: { type: "boolean" } },
        plannedDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["elapsedDurations", "blocked", "plannedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockedTime: { type: "number" },
        observedTime: { type: "number" },
        observedBlockedShare: { type: "number" },
        plannedBlockedShare: { type: "number" },
      },
      required: [
        "blockedTime",
        "observedTime",
        "observedBlockedShare",
        "plannedBlockedShare",
      ],
    },
    ports: {
      inputs: [
        {
          id: "elapsedDurations",
          label: "Elapsed Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "blocked",
          label: "Blocked",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "plannedDuration",
          label: "Planned Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "blockedTime",
          label: "Blocked Time",
          valueType: { type: "number" },
        },
        {
          id: "observedTime",
          label: "Observed Time",
          valueType: { type: "number" },
        },
        {
          id: "observedBlockedShare",
          label: "Observed Blocked Share",
          valueType: { type: "number" },
        },
        {
          id: "plannedBlockedShare",
          label: "Planned Blocked Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskBlockedTimeShareTool.execute;
export default taskBlockedTimeShareTool;
