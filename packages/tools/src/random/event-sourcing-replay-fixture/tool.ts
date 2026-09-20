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
  scalar,
  flatSchema,
  type Scalar,
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty, budget } from "../m500b-web-json-json.js";
export type EventSourcingReplayFixtureInput = {
  readonly entities: readonly string[];
  readonly fields: readonly string[];
  readonly values: readonly { readonly value: Scalar }[];
  readonly operations: readonly ("set" | "remove")[];
  readonly eventCount: number;
  readonly seed?: number;
};
export type EventSourcingReplayFixtureOutput = {
  readonly events: readonly {
    readonly sequence: number;
    readonly entity: string;
    readonly field: string;
    readonly operation: string;
    readonly value: Scalar;
    readonly before: Readonly<Record<string, Scalar>>;
    readonly after: Readonly<Record<string, Scalar>>;
  }[];
  readonly snapshots: readonly {
    readonly entity: string;
    readonly state: Readonly<Record<string, Scalar>>;
  }[];
  readonly pretty: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    entities: array(label, 8, 1),
    fields: array(label, 8, 1),
    values: array(object({ value: scalar }), 16, 1),
    operations: array(choice(["set", "remove"]), 2, 1),
    eventCount: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["entities", "fields", "values", "operations", "eventCount"],
);
export const outputSchema = object({
  events: array(
    object({
      sequence: bounded(1, 32),
      entity: text,
      field: text,
      operation: text,
      value: scalar,
      before: flatSchema,
      after: flatSchema,
    }),
    32,
    1,
  ),
  snapshots: array(object({ entity: text, state: flatSchema }), 8, 1),
  pretty: text,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is EventSourcingReplayFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateEventSourcingReplayFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<EventSourcingReplayFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(input.entities, "entities");
    distinct(input.fields, "fields");
    budget(
      input.eventCount,
      input.entities.length * input.fields.length,
      "eventCount",
    );
    const stateBound =
      input.fields.length *
      (Math.max(...input.fields.map((f) => JSON.stringify(f).length)) +
        Math.max(...input.values.map((v) => JSON.stringify(v.value).length)) +
        8);
    budget(
      input.eventCount * 3 + input.entities.length * 4,
      stateBound,
      "eventCount",
      700000,
    );
    const random = createGeneratorRandom(input.seed, context),
      state = new Map<string, Record<string, Scalar>>(
        input.entities.map((e) => [e, {}]),
      );
    const events = Array.from({ length: input.eventCount }, (_, i) => {
      const entity = pick(input.entities, random),
        field = pick(input.fields, random),
        operation = pick(input.operations, random),
        drawn = pick(input.values, random).value,
        value = operation === "remove" ? null : drawn === 0 ? 0 : drawn,
        document = state.get(entity);
      if (!document) throw new Error("Missing supplied entity state");
      const before = { ...document };
      if (operation === "remove") delete document[field];
      else
        Object.defineProperty(document, field, {
          value,
          enumerable: true,
          writable: true,
          configurable: true,
        });
      return {
        sequence: i + 1,
        entity,
        field,
        operation,
        value,
        before,
        after: { ...document },
      };
    });
    const snapshots = input.entities.map((entity) => ({
      entity,
      state: { ...state.get(entity) },
    }));
    return toolSuccess({
      events,
      snapshots,
      pretty: pretty(snapshots),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const eventSourcingReplayFixtureExample = {
  input: {
    entities: ["item"],
    fields: ["count"],
    values: [{ value: 3 }, { value: 7 }],
    operations: ["set", "remove"],
    eventCount: 2,
    seed: 42,
  },
  output: {
    events: [
      {
        sequence: 1,
        entity: "item",
        field: "count",
        operation: "remove",
        value: null,
        before: {},
        after: {},
      },
      {
        sequence: 2,
        entity: "item",
        field: "count",
        operation: "set",
        value: 7,
        before: {},
        after: { count: 7 },
      },
    ],
    snapshots: [{ entity: "item", state: { count: 7 } }],
    pretty:
      '[\n  {\n    "entity": "item",\n    "state": {\n      "count": 7\n    }\n  }\n]\n',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  EventSourcingReplayFixtureInput,
  EventSourcingReplayFixtureOutput
>;
export const eventSourcingReplayFixtureTool = createModelDefinition<
  EventSourcingReplayFixtureInput,
  EventSourcingReplayFixtureOutput
>({
  id: "random/event-sourcing-replay-fixture",
  title: "Random Event Sourcing Replay Fixture Generator",
  description:
    "Construct declarative synthetic set/remove entity events and retain before/after snapshots and final state without evaluating supplied code.",
  inputSchema,
  outputSchema,
  execute: calculateEventSourcingReplayFixture,
});
export const runEventSourcingReplayFixture =
  eventSourcingReplayFixtureTool.execute;
export default eventSourcingReplayFixtureTool;
