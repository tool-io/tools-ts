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
  timesSchema,
  scheduleSchema,
  scheduleOrderedJobs,
  type ScheduledOperation,
} from "../scheduling-instance-construction.js";

export type FlowShopSchedulingInstanceInput = {
  readonly jobCount: number;
  readonly machineCount: number;
  readonly minimumDuration: number;
  readonly maximumDuration: number;
  readonly seed?: number;
};
export type FlowShopSchedulingInstanceOutput = {
  readonly processingTimes: readonly (readonly number[])[];
  readonly machineOrder: readonly (readonly number[])[];
  readonly schedule: readonly ScheduledOperation[];
  readonly makespan: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jobCount: schedulingCountSchema,
    machineCount: machineCountSchema,
    minimumDuration: processingTimeSchema,
    maximumDuration: processingTimeSchema,
    seed: generatorSeedSchema,
  },
  required: ["jobCount", "machineCount", "minimumDuration", "maximumDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    processingTimes: timesSchema,
    machineOrder: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 16,
        items: { type: "integer", minimum: 0, maximum: 15 },
      },
    },
    schedule: scheduleSchema,
    makespan: processingTimeSchema,
    randomness: generatorReplaySchema,
  },
  required: [
    "processingTimes",
    "machineOrder",
    "schedule",
    "makespan",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is FlowShopSchedulingInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateFlowShopSchedulingInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FlowShopSchedulingInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.jobCount * input.machineCount > 512)
      simpleError(
        "jobCount",
        "At most 512 operations may be generated.",
        "resource_limit",
      );
    if (input.maximumDuration < input.minimumDuration)
      simpleError(
        "maximumDuration",
        "Duration bounds must be ordered.",
        "invalid_integer_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const processingTimes = Array.from({ length: input.jobCount }, () =>
      Array.from({ length: input.machineCount }, () =>
        random.integer(input.minimumDuration, input.maximumDuration),
      ),
    );
    const machines = Array.from({ length: input.machineCount }, (_, i) => i);
    const machineOrder = processingTimes.map(() => [...machines]);
    const schedule = scheduleOrderedJobs(
      processingTimes,
      machineOrder,
      input.machineCount,
    );
    return toolSuccess({
      processingTimes,
      machineOrder,
      schedule,
      makespan: Math.max(...schedule.map((operation) => operation.end)),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const flowShopSchedulingInstanceExample = {
  input: {
    jobCount: 2,
    machineCount: 3,
    minimumDuration: 2,
    maximumDuration: 7,
    seed: 42,
  },
  output: {
    processingTimes: [
      [5, 4, 7],
      [6, 3, 5],
    ],
    machineOrder: [
      [0, 1, 2],
      [0, 1, 2],
    ],
    schedule: [
      {
        job: 0,
        operation: 0,
        machine: 0,
        start: 0,
        end: 5,
      },
      {
        job: 0,
        operation: 1,
        machine: 1,
        start: 5,
        end: 9,
      },
      {
        job: 0,
        operation: 2,
        machine: 2,
        start: 9,
        end: 16,
      },
      {
        job: 1,
        operation: 0,
        machine: 0,
        start: 5,
        end: 11,
      },
      {
        job: 1,
        operation: 1,
        machine: 1,
        start: 11,
        end: 14,
      },
      {
        job: 1,
        operation: 2,
        machine: 2,
        start: 16,
        end: 21,
      },
    ],
    makespan: 21,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FlowShopSchedulingInstanceInput,
  FlowShopSchedulingInstanceOutput
>;
export const flowShopSchedulingInstanceTool = createModelDefinition<
  FlowShopSchedulingInstanceInput,
  FlowShopSchedulingInstanceOutput
>({
  id: "random/flow-shop-scheduling-instance",
  title: "Random Flow-Shop Scheduling Instance Generator",
  description:
    "Generate positive integer processing times in a common machine order with a feasible job-priority schedule witness; no makespan optimality claim.",
  inputSchema,
  outputSchema,
  execute: calculateFlowShopSchedulingInstance,
});
export const runFlowShopSchedulingInstance =
  flowShopSchedulingInstanceTool.execute;
export default flowShopSchedulingInstanceTool;
