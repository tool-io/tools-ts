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
import {
  arraySchema,
  objectSchema,
  integerSchema,
  countSchema,
  enumSchema,
  booleanSchema,
  nullableSchema,
  distinct,
  ordered,
} from "../m500b-csv-algorithms-schemas.js";
import { sortedNumbers } from "../m500b-csv-algorithms-sequence.js";

type HeapEntry = { readonly id: number; readonly priority: number };
type PriorityOperation = "insert" | "update" | "extract";
export type PriorityQueueOperationTraceInput = {
  readonly initialPriorities: readonly number[];
  readonly operations: readonly PriorityOperation[];
  readonly eventCount: number;
  readonly minimumPriority: number;
  readonly maximumPriority: number;
  readonly tieBreak: "oldest" | "newest";
  readonly seed?: number;
};
type HeapEvent = {
  readonly kind: PriorityOperation;
  readonly entry: HeapEntry | null;
  readonly missing: boolean;
  readonly heap: readonly HeapEntry[];
};
export type PriorityQueueOperationTraceOutput = {
  readonly events: readonly HeapEvent[];
  readonly finalHeap: readonly HeapEntry[];
  readonly randomness: GeneratorReplay;
};
const operationSchema = enumSchema(["insert", "update", "extract"]),
  entrySchema = objectSchema({ id: countSchema(79), priority: integerSchema }),
  heapSchema = arraySchema(entrySchema, 80);
export const inputSchema = objectSchema(
  {
    initialPriorities: arraySchema(integerSchema, 16),
    operations: arraySchema(operationSchema, 3, 1),
    eventCount: countSchema(64, 1),
    minimumPriority: integerSchema,
    maximumPriority: integerSchema,
    tieBreak: enumSchema(["oldest", "newest"]),
    seed: generatorSeedSchema,
  },
  [
    "initialPriorities",
    "operations",
    "eventCount",
    "minimumPriority",
    "maximumPriority",
    "tieBreak",
  ],
);
export const outputSchema = objectSchema({
  events: arraySchema(
    objectSchema({
      kind: operationSchema,
      entry: nullableSchema(entrySchema),
      missing: booleanSchema,
      heap: heapSchema,
    }),
    64,
  ),
  finalHeap: heapSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is PriorityQueueOperationTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculatePriorityQueueOperationTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PriorityQueueOperationTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.operations, "operations");
    ordered(input.minimumPriority, input.maximumPriority, "maximumPriority");
    if (
      input.eventCount * (input.initialPriorities.length + input.eventCount) >
      4096
    )
      return simpleError(
        "eventCount",
        "Heap history is limited to 4096 potential entry snapshots.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      heap: HeapEntry[] = input.initialPriorities.map((priority, id) => ({
        id,
        priority: priority || 0,
      }));
    let nextId = heap.length;
    const at = (index: number): HeapEntry => {
      const entry = heap[index];
      if (!entry) throw new Error("Missing heap entry.");
      return entry;
    };
    const before = (a: HeapEntry, b: HeapEntry): boolean =>
      a.priority === b.priority
        ? input.tieBreak === "oldest"
          ? a.id < b.id
          : a.id > b.id
        : a.priority < b.priority;
    const swap = (a: number, b: number): void => {
      const saved = at(a);
      heap[a] = at(b);
      heap[b] = saved;
    };
    const down = (start: number): void => {
      let index = start;
      while (2 * index + 1 < heap.length) {
        let child = 2 * index + 1;
        if (child + 1 < heap.length && before(at(child + 1), at(child)))
          child += 1;
        if (!before(at(child), at(index))) break;
        swap(index, child);
        index = child;
      }
    };
    const rebuild = (): void => {
      for (let index = Math.floor(heap.length / 2) - 1; index >= 0; index -= 1)
        down(index);
    };
    rebuild();
    const events = Array.from({ length: input.eventCount }, (): HeapEvent => {
      const kind = random.pick(input.operations);
      let entry: HeapEntry | null = null;
      if (kind === "insert") {
        entry = {
          id: nextId++,
          priority: random.integer(
            input.minimumPriority,
            input.maximumPriority,
          ),
        };
        heap.push(entry);
        let index = heap.length - 1;
        while (index > 0) {
          const parent = Math.floor((index - 1) / 2);
          if (!before(at(index), at(parent))) break;
          swap(index, parent);
          index = parent;
        }
      } else if (kind === "update" && heap.length > 0) {
        const index = random.integer(0, heap.length - 1);
        entry = {
          id: at(index).id,
          priority: random.integer(
            input.minimumPriority,
            input.maximumPriority,
          ),
        };
        heap[index] = entry;
        rebuild();
      } else if (kind === "extract" && heap.length > 0) {
        entry = at(0);
        const last = heap.pop();
        if (heap.length > 0) {
          if (!last) throw new Error("Missing removed heap tail.");
          heap[0] = last;
          down(0);
        }
      }
      if (
        heap.length > 0 &&
        at(0).priority !== sortedNumbers(heap.map((item) => item.priority))[0]
      )
        throw new Error("Heap minimum disagrees with numeric sort core.");
      return {
        kind,
        entry,
        missing: entry === null,
        heap: heap.map((item) => ({ ...item })),
      };
    });
    return toolSuccess({
      events,
      finalHeap: heap.map((entry) => ({ ...entry })),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const priorityQueueOperationTraceExample = {
  input: {
    initialPriorities: [2],
    operations: ["insert", "update", "extract"],
    eventCount: 3,
    minimumPriority: 0,
    maximumPriority: 3,
    tieBreak: "oldest",
    seed: 42,
  },
  output: {
    events: [
      {
        kind: "update",
        entry: { id: 0, priority: 3 },
        missing: false,
        heap: [{ id: 0, priority: 3 }],
      },
      {
        kind: "extract",
        entry: { id: 0, priority: 3 },
        missing: false,
        heap: [],
      },
      {
        kind: "insert",
        entry: { id: 1, priority: 2 },
        missing: false,
        heap: [{ id: 1, priority: 2 }],
      },
    ],
    finalHeap: [{ id: 1, priority: 2 }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PriorityQueueOperationTraceInput,
  PriorityQueueOperationTraceOutput
>;
export const priorityQueueOperationTraceTool = createModelDefinition<
  PriorityQueueOperationTraceInput,
  PriorityQueueOperationTraceOutput
>({
  id: "random/priority-queue-operation-trace",
  title: "Random Priority Queue Operation Trace Generator",
  description:
    "Generate insert, existing-heap-slot update and extract-min operations on a binary heap with explicit insertion-age ties, heap snapshots and empty-operation controls.",
  inputSchema,
  outputSchema,
  execute: calculatePriorityQueueOperationTrace,
});
export const runPriorityQueueOperationTrace =
  priorityQueueOperationTraceTool.execute;
export default priorityQueueOperationTraceTool;
