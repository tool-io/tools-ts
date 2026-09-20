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
  choice,
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type IdempotencyKeyReplayFixtureInput = {
  readonly keys: readonly string[];
  readonly payloads: readonly string[];
  readonly modes: readonly ("new" | "retry" | "conflict")[];
  readonly count: number;
  readonly seed?: number;
};
export type IdempotencyKeyReplayFixtureOutput = {
  readonly operations: readonly {
    readonly key: string;
    readonly payload: string;
    readonly mode: string;
    readonly outcome: "accepted" | "duplicate" | "conflict";
    readonly retainedPayload: string;
  }[];
  readonly accepted: readonly {
    readonly key: string;
    readonly payload: string;
  }[];
  readonly pretty: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    keys: array(label, 16, 1),
    payloads: array(text, 16, 1),
    modes: array(choice(["new", "retry", "conflict"]), 3, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["keys", "payloads", "modes", "count"],
);
export const outputSchema = object({
  operations: array(
    object({
      key: text,
      payload: text,
      mode: text,
      outcome: choice(["accepted", "duplicate", "conflict"]),
      retainedPayload: text,
    }),
    32,
    1,
  ),
  accepted: array(object({ key: text, payload: text }), 32),
  pretty: text,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is IdempotencyKeyReplayFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateIdempotencyKeyReplayFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<IdempotencyKeyReplayFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(input.keys, "keys");
    const random = createGeneratorRandom(input.seed, context),
      acceptedMap = new Map<string, string>(),
      operations = Array.from(
        { length: input.count },
        (_, i): IdempotencyKeyReplayFixtureOutput["operations"][number] => {
          const mode = pick(input.modes, random);
          let key: string, payload: string;
          if (i > 0 && mode !== "new") {
            const prior = pick([...acceptedMap], random);
            key = prior[0];
            payload = prior[1] + (mode === "conflict" ? "!" : "");
          } else {
            key = pick(input.keys, random);
            payload = pick(input.payloads, random);
          }
          const prior = acceptedMap.get(key),
            outcome =
              prior === undefined
                ? "accepted"
                : prior === payload
                  ? "duplicate"
                  : "conflict";
          if (prior === undefined) acceptedMap.set(key, payload);
          return {
            key,
            payload,
            mode,
            outcome,
            retainedPayload: acceptedMap.get(key) ?? "",
          };
        },
      );
    const accepted = [...acceptedMap].map(([key, payload]) => ({
      key,
      payload,
    }));
    return toolSuccess({
      operations,
      accepted,
      pretty: pretty(accepted),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const idempotencyKeyReplayFixtureExample = {
  input: {
    keys: ["op1"],
    payloads: ["A"],
    modes: ["retry"],
    count: 3,
    seed: 42,
  },
  output: {
    operations: [
      {
        key: "op1",
        payload: "A",
        mode: "retry",
        outcome: "accepted",
        retainedPayload: "A",
      },
      {
        key: "op1",
        payload: "A",
        mode: "retry",
        outcome: "duplicate",
        retainedPayload: "A",
      },
      {
        key: "op1",
        payload: "A",
        mode: "retry",
        outcome: "duplicate",
        retainedPayload: "A",
      },
    ],
    accepted: [{ key: "op1", payload: "A" }],
    pretty: '[\n  {\n    "key": "op1",\n    "payload": "A"\n  }\n]\n',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  IdempotencyKeyReplayFixtureInput,
  IdempotencyKeyReplayFixtureOutput
>;
export const idempotencyKeyReplayFixtureTool = createModelDefinition<
  IdempotencyKeyReplayFixtureInput,
  IdempotencyKeyReplayFixtureOutput
>({
  id: "random/idempotency-key-replay-fixture",
  title: "Random Idempotency Key Replay Fixture Generator",
  description:
    "Construct original, retry and conflicting-payload operations with exact-string idempotency rules and retained accepted-payload state.",
  inputSchema,
  outputSchema,
  execute: calculateIdempotencyKeyReplayFixture,
});
export const runIdempotencyKeyReplayFixture =
  idempotencyKeyReplayFixtureTool.execute;
export default idempotencyKeyReplayFixtureTool;
