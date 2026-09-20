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
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  label,
  bounded,
  integer,
  choice,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type OptimisticLockConflictFixtureInput = {
  readonly clients: readonly string[];
  readonly initialVersion: number;
  readonly initialValue: string;
  readonly values: readonly string[];
  readonly operations: readonly ("read" | "write")[];
  readonly count: number;
  readonly seed?: number;
};
export type OptimisticLockConflictFixtureOutput = {
  readonly initialReads: readonly {
    readonly client: string;
    readonly version: number;
  }[];
  readonly trace: readonly {
    readonly client: string;
    readonly operation: string;
    readonly expectedVersion: number;
    readonly versionBefore: number;
    readonly versionAfter: number;
    readonly valueBefore: string;
    readonly valueAfter: string;
    readonly accepted: boolean;
  }[];
  readonly finalVersion: number;
  readonly finalValue: string;
  readonly pretty: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    clients: array(label, 8, 1),
    initialVersion: { type: "integer", minimum: 0 },
    initialValue: text,
    values: array(text, 16, 1),
    operations: array(choice(["read", "write"]), 2, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  [
    "clients",
    "initialVersion",
    "initialValue",
    "values",
    "operations",
    "count",
  ],
);
export const outputSchema = object({
  initialReads: array(object({ client: text, version: integer }), 8, 1),
  trace: array(
    object({
      client: text,
      operation: text,
      expectedVersion: integer,
      versionBefore: integer,
      versionAfter: integer,
      valueBefore: text,
      valueAfter: text,
      accepted: boolean,
    }),
    32,
    1,
  ),
  finalVersion: integer,
  finalValue: text,
  pretty: text,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is OptimisticLockConflictFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateOptimisticLockConflictFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<OptimisticLockConflictFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(input.clients, "clients");
    if (!Number.isSafeInteger(input.initialVersion + input.count))
      simpleError(
        "initialVersion",
        "Version increments must remain safe integers.",
        "unsafe_version",
      );
    const random = createGeneratorRandom(input.seed, context),
      initialReads = input.clients.map((client) => ({
        client,
        version: input.initialVersion,
      })),
      cached = new Map(input.clients.map((c) => [c, input.initialVersion]));
    let version = input.initialVersion,
      value = input.initialValue;
    const trace = Array.from({ length: input.count }, () => {
      const client = pick(input.clients, random),
        operation = pick(input.operations, random),
        expectedVersion = cached.get(client) ?? input.initialVersion,
        versionBefore = version,
        valueBefore = value;
      let accepted = true;
      if (operation === "read") cached.set(client, version);
      else {
        const next = pick(input.values, random);
        accepted = expectedVersion === version;
        if (accepted) {
          version += 1;
          value = next;
        }
      }
      return {
        client,
        operation,
        expectedVersion,
        versionBefore,
        versionAfter: version,
        valueBefore,
        valueAfter: value,
        accepted,
      };
    });
    return toolSuccess({
      initialReads,
      trace,
      finalVersion: version,
      finalValue: value,
      pretty: pretty({ version, value }),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const optimisticLockConflictFixtureExample = {
  input: {
    clients: ["a", "b"],
    initialVersion: 0,
    initialValue: "old",
    values: ["new"],
    operations: ["write"],
    count: 2,
    seed: 42,
  },
  output: {
    initialReads: [
      { client: "a", version: 0 },
      { client: "b", version: 0 },
    ],
    trace: [
      {
        client: "b",
        operation: "write",
        expectedVersion: 0,
        versionBefore: 0,
        versionAfter: 1,
        valueBefore: "old",
        valueAfter: "new",
        accepted: true,
      },
      {
        client: "b",
        operation: "write",
        expectedVersion: 0,
        versionBefore: 1,
        versionAfter: 1,
        valueBefore: "new",
        valueAfter: "new",
        accepted: false,
      },
    ],
    finalVersion: 1,
    finalValue: "new",
    pretty: '{\n  "version": 1,\n  "value": "new"\n}\n',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  OptimisticLockConflictFixtureInput,
  OptimisticLockConflictFixtureOutput
>;
export const optimisticLockConflictFixtureTool = createModelDefinition<
  OptimisticLockConflictFixtureInput,
  OptimisticLockConflictFixtureOutput
>({
  id: "random/optimistic-lock-conflict-fixture",
  title: "Random Optimistic Lock Conflict Fixture Generator",
  description:
    "Construct synthetic client read/write version traces, retaining cached reads, successful version increments and state-preserving stale-write rejections.",
  inputSchema,
  outputSchema,
  execute: calculateOptimisticLockConflictFixture,
});
export const runOptimisticLockConflictFixture =
  optimisticLockConflictFixtureTool.execute;
export default optimisticLockConflictFixtureTool;
