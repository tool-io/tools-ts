import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  schedulingCountSchema,
  machineCountSchema,
  processingTimeSchema,
  scheduleSchema,
  exactScheduleEnd,
  type ScheduledOperation,
} from "../scheduling-instance-construction.js";

export type MultiprocessorSchedulingInstanceInput = {
  readonly jobCount: number;
  readonly processorCount: number;
  readonly minimumDuration: number;
  readonly maximumDuration: number;
  readonly seed?: number;
};
export type MultiprocessorSchedulingInstanceOutput = {
  readonly durations: readonly number[];
  readonly schedule: readonly ScheduledOperation[];
  readonly processorLoads: readonly number[];
  readonly makespan: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jobCount: schedulingCountSchema,
    processorCount: machineCountSchema,
    minimumDuration: processingTimeSchema,
    maximumDuration: processingTimeSchema,
    seed: generatorSeedSchema,
  },
  required: [
    "jobCount",
    "processorCount",
    "minimumDuration",
    "maximumDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: processingTimeSchema,
    },
    schedule: scheduleSchema,
    processorLoads: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "integer", minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
    },
    makespan: processingTimeSchema,
    randomness: generatorReplaySchema,
  },
  required: [
    "durations",
    "schedule",
    "processorLoads",
    "makespan",
    "randomness",
  ],
} as const;

const isInput = (
  input: unknown,
): input is MultiprocessorSchedulingInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateMultiprocessorSchedulingInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MultiprocessorSchedulingInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.maximumDuration < input.minimumDuration)
      simpleError(
        "maximumDuration",
        "Duration bounds must be ordered.",
        "invalid_integer_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const durations = Array.from({ length: input.jobCount }, () =>
      random.integer(input.minimumDuration, input.maximumDuration),
    );
    const processorLoads = Array<number>(input.processorCount).fill(0);
    const schedule: ScheduledOperation[] = durations.map((duration, job) => {
      const machine = processorLoads.indexOf(Math.min(...processorLoads));
      const start = processorLoads[machine],
        end = exactScheduleEnd(start, duration);
      processorLoads[machine] = end;
      return { job, operation: 0, machine, start, end };
    });
    return toolSuccess({
      durations,
      schedule,
      processorLoads,
      makespan: Math.max(...processorLoads),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const multiprocessorSchedulingInstanceExample = {
  input: {
    jobCount: 5,
    processorCount: 2,
    minimumDuration: 2,
    maximumDuration: 9,
    seed: 42,
  },
  output: {
    durations: [6, 5, 8, 7, 3],
    schedule: [
      {
        job: 0,
        operation: 0,
        machine: 0,
        start: 0,
        end: 6,
      },
      {
        job: 1,
        operation: 0,
        machine: 1,
        start: 0,
        end: 5,
      },
      {
        job: 2,
        operation: 0,
        machine: 1,
        start: 5,
        end: 13,
      },
      {
        job: 3,
        operation: 0,
        machine: 0,
        start: 6,
        end: 13,
      },
      {
        job: 4,
        operation: 0,
        machine: 0,
        start: 13,
        end: 16,
      },
    ],
    processorLoads: [16, 13],
    makespan: 16,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  MultiprocessorSchedulingInstanceInput,
  MultiprocessorSchedulingInstanceOutput
>;
export const multiprocessorSchedulingInstanceTool = createModelDefinition<
  MultiprocessorSchedulingInstanceInput,
  MultiprocessorSchedulingInstanceOutput
>({
  id: "random/multiprocessor-scheduling-instance",
  title: "Random Multiprocessor Scheduling Instance Generator",
  description:
    "Generate nonpreemptive independent positive-integer jobs for identical parallel processors, with an earliest-available list-scheduling witness; no optimality claim.",
  inputSchema,
  outputSchema,
  execute: calculateMultiprocessorSchedulingInstance,
});
export const runMultiprocessorSchedulingInstance =
  multiprocessorSchedulingInstanceTool.execute;
export default multiprocessorSchedulingInstanceTool;
