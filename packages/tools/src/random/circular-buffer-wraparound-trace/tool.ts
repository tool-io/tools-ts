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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateCircularBufferIndex } from "../../microcontroller/circular-buffer-index/tool.js";
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

type BufferOperation = "read" | "write";
export type CircularBufferWraparoundTraceInput = {
  readonly capacity: number;
  readonly operations: readonly BufferOperation[];
  readonly eventCount: number;
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly overflowPolicy: "reject" | "overwrite";
  readonly seed?: number;
};
type BufferEvent = {
  readonly kind: BufferOperation;
  readonly value: number | null;
  readonly accepted: boolean;
  readonly overflow: boolean;
  readonly underflow: boolean;
  readonly evicted: number | null;
  readonly head: number;
  readonly tail: number;
  readonly size: number;
  readonly cells: readonly (number | null)[];
};
export type CircularBufferWraparoundTraceOutput = {
  readonly events: readonly BufferEvent[];
  readonly finalValues: readonly number[];
  readonly randomness: GeneratorReplay;
};
const operationSchema = enumSchema(["read", "write"]),
  cellSchema = nullableSchema(integerSchema);
export const inputSchema = objectSchema(
  {
    capacity: countSchema(16, 1),
    operations: arraySchema(operationSchema, 2, 1),
    eventCount: countSchema(64, 1),
    minimumValue: integerSchema,
    maximumValue: integerSchema,
    overflowPolicy: enumSchema(["reject", "overwrite"]),
    seed: generatorSeedSchema,
  },
  [
    "capacity",
    "operations",
    "eventCount",
    "minimumValue",
    "maximumValue",
    "overflowPolicy",
  ],
);
export const outputSchema = objectSchema({
  events: arraySchema(
    objectSchema({
      kind: operationSchema,
      value: cellSchema,
      accepted: booleanSchema,
      overflow: booleanSchema,
      underflow: booleanSchema,
      evicted: cellSchema,
      head: countSchema(15),
      tail: countSchema(15),
      size: countSchema(16),
      cells: arraySchema(cellSchema, 16, 1),
    }),
    64,
  ),
  finalValues: arraySchema(integerSchema, 16),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CircularBufferWraparoundTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateCircularBufferWraparoundTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CircularBufferWraparoundTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.operations, "operations");
    ordered(input.minimumValue, input.maximumValue);
    const random = createGeneratorRandom(input.seed, context),
      cells: (number | null)[] = Array<number | null>(input.capacity).fill(
        null,
      );
    let head = 0,
      tail = 0,
      size = 0;
    const advance = (index: number, offset = 1): number =>
      calculateCircularBufferIndex({
        headIndex: index,
        offset,
        capacity: input.capacity,
      }).wrappedIndex;
    const events = Array.from({ length: input.eventCount }, (): BufferEvent => {
      const kind = random.pick(input.operations),
        underflow = kind === "read" && size === 0,
        overflow = kind === "write" && size === input.capacity;
      let value: number | null = null,
        evicted: number | null = null,
        accepted = false;
      if (kind === "read" && !underflow) {
        const read = cells[head];
        if (read === null || read === undefined)
          throw new Error("Occupied buffer cell missing.");
        value = read;
        cells[head] = null;
        head = advance(head);
        size -= 1;
        accepted = true;
      } else if (kind === "write") {
        value = random.integer(input.minimumValue, input.maximumValue);
        if (!overflow || input.overflowPolicy === "overwrite") {
          if (overflow) {
            evicted = cells[head] ?? null;
            head = advance(head);
          } else size += 1;
          cells[tail] = value;
          tail = advance(tail);
          accepted = true;
        }
      }
      return {
        kind,
        value,
        accepted,
        overflow,
        underflow,
        evicted,
        head,
        tail,
        size,
        cells: [...cells],
      };
    });
    const finalValues = Array.from({ length: size }, (_, offset) => {
      const value = cells[advance(head, offset)];
      if (value === null || value === undefined)
        throw new Error("Logical buffer cell missing.");
      return value;
    });
    return toolSuccess({
      events,
      finalValues,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const circularBufferWraparoundTraceExample = {
  input: {
    capacity: 2,
    operations: ["read", "write"],
    eventCount: 5,
    minimumValue: 1,
    maximumValue: 3,
    overflowPolicy: "overwrite",
    seed: 42,
  },
  output: {
    events: [
      {
        kind: "write",
        value: 2,
        accepted: true,
        overflow: false,
        underflow: false,
        evicted: null,
        head: 0,
        tail: 1,
        size: 1,
        cells: [2, null],
      },
      {
        kind: "write",
        value: 3,
        accepted: true,
        overflow: false,
        underflow: false,
        evicted: null,
        head: 0,
        tail: 0,
        size: 2,
        cells: [2, 3],
      },
      {
        kind: "read",
        value: 2,
        accepted: true,
        overflow: false,
        underflow: false,
        evicted: null,
        head: 1,
        tail: 0,
        size: 1,
        cells: [null, 3],
      },
      {
        kind: "write",
        value: 1,
        accepted: true,
        overflow: false,
        underflow: false,
        evicted: null,
        head: 1,
        tail: 1,
        size: 2,
        cells: [1, 3],
      },
      {
        kind: "write",
        value: 3,
        accepted: true,
        overflow: true,
        underflow: false,
        evicted: 3,
        head: 0,
        tail: 0,
        size: 2,
        cells: [1, 3],
      },
    ],
    finalValues: [1, 3],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CircularBufferWraparoundTraceInput,
  CircularBufferWraparoundTraceOutput
>;
export const circularBufferWraparoundTraceTool = createModelDefinition<
  CircularBufferWraparoundTraceInput,
  CircularBufferWraparoundTraceOutput
>({
  id: "random/circular-buffer-wraparound-trace",
  title: "Random Circular Buffer Wraparound Trace Generator",
  description:
    "Simulate sampled reads and writes with delegated circular indices, explicit next-read head and next-write tail, occupancy, underflow and selected reject-or-overwrite overflow semantics.",
  inputSchema,
  outputSchema,
  execute: calculateCircularBufferWraparoundTrace,
});
export const runCircularBufferWraparoundTrace =
  circularBufferWraparoundTraceTool.execute;
export default circularBufferWraparoundTraceTool;
