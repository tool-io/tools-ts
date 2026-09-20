import { runCumulativeSum } from "../list/cumulative-sum/tool.js";
import { simpleError } from "../core/simple.js";

export type ScheduledOperation = {
  readonly job: number;
  readonly operation: number;
  readonly machine: number;
  readonly start: number;
  readonly end: number;
};
export const schedulingCountSchema = {
  type: "integer",
  minimum: 1,
  maximum: 64,
} as const;
export const machineCountSchema = {
  type: "integer",
  minimum: 1,
  maximum: 16,
} as const;
export const processingTimeSchema = {
  type: "integer",
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER,
} as const;
export const timesSchema = {
  type: "array",
  minItems: 1,
  maxItems: 64,
  items: {
    type: "array",
    minItems: 1,
    maxItems: 16,
    items: processingTimeSchema,
  },
} as const;
export const scheduleSchema = {
  type: "array",
  minItems: 1,
  maxItems: 512,
  items: {
    type: "object",
    additionalProperties: false,
    properties: {
      job: { type: "integer", minimum: 0, maximum: 63 },
      operation: { type: "integer", minimum: 0, maximum: 15 },
      machine: { type: "integer", minimum: 0, maximum: 15 },
      start: { type: "integer", minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
      end: { type: "integer", minimum: 1, maximum: Number.MAX_SAFE_INTEGER },
    },
    required: ["job", "operation", "machine", "start", "end"],
  },
} as const;
export const exactScheduleEnd = (start: number, duration: number): number => {
  const result = runCumulativeSum({ values: [start, duration] });
  if (!result.ok)
    return simpleError(
      "maximumDuration",
      "The schedule cannot be represented finitely.",
      "unsafe_schedule_time",
    );
  const end: unknown = result.output.sums[1];
  if (typeof end !== "number" || !Number.isSafeInteger(end))
    return simpleError(
      "maximumDuration",
      "All scheduled times must remain safe integers.",
      "unsafe_schedule_time",
    );
  return end;
};
/** Fixed job-priority list scheduling: a witness, not an optimization algorithm. */
export const scheduleOrderedJobs = (
  times: readonly (readonly number[])[],
  orders: readonly (readonly number[])[],
  machineCount: number,
): ScheduledOperation[] => {
  const available = Array<number>(machineCount).fill(0);
  const schedule: ScheduledOperation[] = [];
  times.forEach((durations, job) => {
    let ready = 0;
    durations.forEach((duration, operation) => {
      const machine = orders[job][operation];
      const start = Math.max(ready, available[machine]);
      const end = exactScheduleEnd(start, duration);
      schedule.push({ job, operation, machine, start, end });
      ready = end;
      available[machine] = end;
    });
  });
  return schedule;
};
