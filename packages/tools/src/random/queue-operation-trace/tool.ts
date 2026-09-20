import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { runChunk } from "../../list/chunk/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  enumSchema,
  booleanSchema,
  nullableSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";

type QueueOperation = "enqueue" | "dequeue" | "peek";
export type QueueOperationTraceInput = {
  readonly initialValues: readonly string[];
  readonly values: readonly string[];
  readonly operations: readonly QueueOperation[];
  readonly eventCount: number;
  readonly pageSize: number;
  readonly seed?: number;
};
type QueueEvent = {
  readonly kind: QueueOperation;
  readonly value: string | null;
  readonly underflow: boolean;
  readonly queue: readonly string[];
};
export type QueueOperationTraceOutput = {
  readonly events: readonly QueueEvent[];
  readonly finalQueue: readonly string[];
  readonly finalPages: readonly (readonly string[])[];
  readonly randomness: GeneratorReplay;
};
const operationSchema = enumSchema(["enqueue", "dequeue", "peek"]),
  queueSchema = arraySchema(textSchema, 80);
export const inputSchema = objectSchema(
  {
    initialValues: arraySchema(textSchema, 16),
    values: arraySchema(textSchema, 16, 1),
    operations: arraySchema(operationSchema, 3, 1),
    eventCount: countSchema(64, 1),
    pageSize: countSchema(16, 1),
    seed: generatorSeedSchema,
  },
  ["initialValues", "values", "operations", "eventCount", "pageSize"],
);
export const outputSchema = objectSchema({
  events: arraySchema(
    objectSchema({
      kind: operationSchema,
      value: nullableSchema(textSchema),
      underflow: booleanSchema,
      queue: queueSchema,
    }),
    64,
  ),
  finalQueue: queueSchema,
  finalPages: arraySchema(arraySchema(textSchema, 16, 1), 80),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is QueueOperationTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateQueueOperationTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<QueueOperationTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.operations, "operations");
    if (
      input.eventCount * (input.initialValues.length + input.eventCount) >
      2048
    )
      return simpleError(
        "eventCount",
        "Queue history is limited to 2048 potential cell snapshots.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      queue = [...input.initialValues];
    const events = Array.from({ length: input.eventCount }, (): QueueEvent => {
      const kind = random.pick(input.operations),
        underflow = kind !== "enqueue" && queue.length === 0;
      let value: string | null;
      if (kind === "enqueue") {
        value = random.pick(input.values);
        queue.push(value);
      } else
        value =
          kind === "dequeue" ? (queue.shift() ?? null) : (queue[0] ?? null);
      return { kind, value, underflow, queue: [...queue] };
    });
    return toolSuccess({
      events,
      finalQueue: [...queue],
      finalPages: coreOutput(runChunk({ values: queue, size: input.pageSize }))
        .chunks.values,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const queueOperationTraceExample = {
  input: {
    initialValues: ["a", "b"],
    values: ["c", "d"],
    operations: ["enqueue", "dequeue", "peek"],
    eventCount: 5,
    pageSize: 2,
    seed: 42,
  },
  output: {
    events: [
      { kind: "dequeue", value: "a", underflow: false, queue: ["b"] },
      { kind: "dequeue", value: "b", underflow: false, queue: [] },
      { kind: "peek", value: null, underflow: true, queue: [] },
      { kind: "peek", value: null, underflow: true, queue: [] },
      { kind: "enqueue", value: "d", underflow: false, queue: ["d"] },
    ],
    finalQueue: ["d"],
    finalPages: [["d"]],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<QueueOperationTraceInput, QueueOperationTraceOutput>;
export const queueOperationTraceTool = createModelDefinition<
  QueueOperationTraceInput,
  QueueOperationTraceOutput
>({
  id: "random/queue-operation-trace",
  title: "Random Queue Operation Trace Generator",
  description:
    "Generate sampled enqueue, dequeue and peek operations with front-to-back FIFO snapshots, deliberate empty-queue controls and a chunked final queue view.",
  inputSchema,
  outputSchema,
  execute: calculateQueueOperationTrace,
});
export const runQueueOperationTrace = queueOperationTraceTool.execute;
export default queueOperationTraceTool;
