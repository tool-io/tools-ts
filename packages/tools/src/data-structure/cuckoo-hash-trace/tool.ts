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
import { generatorFailure } from "../../random/generator-random.js";

export type CuckooOperation = {
  readonly operation: "insert" | "lookup" | "delete";
  readonly key: number;
};
export type CuckooMove = {
  readonly table: number;
  readonly slot: number;
  readonly incomingKey: number;
  readonly evictedKey: number | null;
};
export type CuckooStep = {
  readonly operation: "insert" | "lookup" | "delete";
  readonly key: number;
  readonly outcome:
    | "inserted"
    | "already-present"
    | "present"
    | "absent"
    | "removed"
    | "rehash-needed";
  readonly moves: readonly CuckooMove[];
};
export type CuckooHashTraceInput = {
  readonly tableSize: number;
  readonly maximumKicks: number;
  readonly operations: readonly CuckooOperation[];
};
export type CuckooHashTraceOutput = {
  readonly tables: {
    readonly first: readonly (number | null)[];
    readonly second: readonly (number | null)[];
  };
  readonly trace: readonly CuckooStep[];
  readonly size: number;
};
const keySchema = {
  type: "integer",
  minimum: 0,
  maximum: Number.MAX_SAFE_INTEGER,
} as const;
const operationSchema = {
  type: "string",
  enum: ["insert", "lookup", "delete"],
} as const;
const slotSchema = { anyOf: [keySchema, { type: "null" }] } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tableSize: { type: "integer", minimum: 1, maximum: 64 },
    maximumKicks: { type: "integer", minimum: 1, maximum: 128 },
    operations: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { operation: operationSchema, key: keySchema },
        required: ["operation", "key"],
      },
    },
  },
  required: ["tableSize", "maximumKicks", "operations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tables: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", minItems: 1, maxItems: 64, items: slotSchema },
        second: { type: "array", minItems: 1, maxItems: 64, items: slotSchema },
      },
      required: ["first", "second"],
    },
    trace: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          operation: operationSchema,
          key: keySchema,
          outcome: {
            type: "string",
            enum: [
              "inserted",
              "already-present",
              "present",
              "absent",
              "removed",
              "rehash-needed",
            ],
          },
          moves: {
            type: "array",
            maxItems: 128,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                table: { type: "integer", minimum: 1, maximum: 2 },
                slot: { type: "integer", minimum: 0, maximum: 63 },
                incomingKey: keySchema,
                evictedKey: slotSchema,
              },
              required: ["table", "slot", "incomingKey", "evictedKey"],
            },
          },
        },
        required: ["operation", "key", "outcome", "moves"],
      },
    },
    size: { type: "integer", minimum: 0, maximum: 128 },
  },
  required: ["tables", "trace", "size"],
} as const;

const isInput = (input: unknown): input is CuckooHashTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateCuckooHashTrace = (
  input: unknown,
): ToolResult<CuckooHashTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const hash = (key: number, table: number): number =>
      Number(
        (table === 0 ? BigInt(key) : BigInt(key) / BigInt(input.tableSize)) %
          BigInt(input.tableSize),
      );
    const tables: (number | null)[][] = [
      Array<number | null>(input.tableSize).fill(null),
      Array<number | null>(input.tableSize).fill(null),
    ];
    const trace: CuckooStep[] = [];
    let work = 0;
    for (const operation of input.operations) {
      const locations = [hash(operation.key, 0), hash(operation.key, 1)];
      const found =
        tables[0][locations[0]] === operation.key
          ? 0
          : tables[1][locations[1]] === operation.key
            ? 1
            : -1;
      const moves: CuckooMove[] = [];
      let outcome: CuckooStep["outcome"];
      if (operation.operation === "lookup")
        outcome = found < 0 ? "absent" : "present";
      else if (operation.operation === "delete") {
        outcome = found < 0 ? "absent" : "removed";
        if (found >= 0) tables[found][locations[found]] = null;
      } else if (found >= 0) outcome = "already-present";
      else {
        const before = tables.map((table) => [...table]);
        let incoming = operation.key,
          table = 0,
          inserted = false;
        for (let kick = 0; kick < input.maximumKicks; kick += 1) {
          if (++work > 4096)
            simpleError(
              "operations",
              "At most 4,096 eviction attempts are supported.",
              "resource_limit",
            );
          const slot = hash(incoming, table),
            evicted = tables[table][slot];
          tables[table][slot] = incoming;
          moves.push({
            table: table + 1,
            slot,
            incomingKey: incoming,
            evictedKey: evicted,
          });
          if (evicted === null) {
            inserted = true;
            break;
          }
          incoming = evicted;
          table = 1 - table;
        }
        outcome = inserted ? "inserted" : "rehash-needed";
        if (!inserted) {
          tables[0] = before[0];
          tables[1] = before[1];
        }
      }
      trace.push({ ...operation, outcome, moves });
    }
    return toolSuccess({
      tables: { first: tables[0], second: tables[1] },
      trace,
      size: tables.flat().filter((key) => key !== null).length,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cuckooHashTraceExample = {
  input: {
    tableSize: 5,
    maximumKicks: 10,
    operations: [
      {
        operation: "insert",
        key: 12,
      },
      {
        operation: "insert",
        key: 17,
      },
      {
        operation: "insert",
        key: 8,
      },
      {
        operation: "lookup",
        key: 12,
      },
      {
        operation: "delete",
        key: 17,
      },
      {
        operation: "lookup",
        key: 17,
      },
    ],
  },
  output: {
    tables: {
      first: [null, null, null, 8, null],
      second: [null, null, 12, null, null],
    },
    trace: [
      {
        operation: "insert",
        key: 12,
        outcome: "inserted",
        moves: [
          {
            table: 1,
            slot: 2,
            incomingKey: 12,
            evictedKey: null,
          },
        ],
      },
      {
        operation: "insert",
        key: 17,
        outcome: "inserted",
        moves: [
          {
            table: 1,
            slot: 2,
            incomingKey: 17,
            evictedKey: 12,
          },
          {
            table: 2,
            slot: 2,
            incomingKey: 12,
            evictedKey: null,
          },
        ],
      },
      {
        operation: "insert",
        key: 8,
        outcome: "inserted",
        moves: [
          {
            table: 1,
            slot: 3,
            incomingKey: 8,
            evictedKey: null,
          },
        ],
      },
      {
        operation: "lookup",
        key: 12,
        outcome: "present",
        moves: [],
      },
      {
        operation: "delete",
        key: 17,
        outcome: "removed",
        moves: [],
      },
      {
        operation: "lookup",
        key: 17,
        outcome: "absent",
        moves: [],
      },
    ],
    size: 2,
  },
} satisfies ToolExample<CuckooHashTraceInput, CuckooHashTraceOutput>;
export const cuckooHashTraceTool = createModelDefinition<
  CuckooHashTraceInput,
  CuckooHashTraceOutput
>({
  discovery: {
    aliases: [
      "Two-Table Cuckoo Hashing Trace",
      "Two-Table Cuckoo Hashing Trace Tool",
      "data structures",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["data-structure", "data structures", "software development"],
    keywords: ["data structures", "software development"],
  },
  id: "data-structure/cuckoo-hash-trace",
  title: "Two-Table Cuckoo Hashing Trace",
  description:
    "Trace insertion evictions, lookups and deletion in two fixed-size integer-key cuckoo tables using h1(k)=k mod m and h2(k)=floor(k/m) mod m; a kick limit rolls back the insertion and signals rehash-needed, without automatic resizing or hash-quality guarantees.",
  inputSchema,
  outputSchema,
  execute: calculateCuckooHashTrace,
});
export const runCuckooHashTrace = cuckooHashTraceTool.execute;
export default cuckooHashTraceTool;
