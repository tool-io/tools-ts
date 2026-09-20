import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
  text,
  label,
  id,
  bool,
  number,
  integer,
  list,
  object,
  enumeration,
  nullable,
  markup,
  parsedSchema,
  choose,
  preview,
  distinct,
  work,
  finite,
  escape,
  parse,
  finish,
} from "../m500b-ui-accessibility-support.js";

type Item = {
  readonly id: string;
  readonly label: string;
  readonly containerId: string;
  readonly eligibleContainerIds: readonly string[];
};
type Container = { readonly id: string; readonly capacity: number };
type Snapshot = { readonly id: string; readonly itemIds: readonly string[] };
export type Input = {
  readonly items: readonly Item[];
  readonly containers: readonly Container[];
  readonly moveCount: number;
  readonly seed?: number;
};
export type Output = {
  readonly initial: readonly Snapshot[];
  readonly events: readonly {
    readonly itemId: string;
    readonly label: string;
    readonly sourceId: string;
    readonly targetId: string;
    readonly accepted: boolean;
    readonly reason: string;
    readonly containers: readonly Snapshot[];
  }[];
  readonly final: readonly Snapshot[];
  readonly randomness: GeneratorReplay;
};
const snapshot = list(object({ id, itemIds: list(id, 16, 0) }), 16);
export const inputSchema = object(
  {
    items: list(
      object({
        id,
        label,
        containerId: id,
        eligibleContainerIds: list(id, 16),
      }),
      16,
    ),
    containers: list(object({ id, capacity: integer(0, 16) }), 16),
    moveCount: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["items", "containers", "moveCount"],
);
export const outputSchema = object({
  initial: snapshot,
  events: list(
    object({
      itemId: id,
      label,
      sourceId: id,
      targetId: id,
      accepted: bool,
      reason: text,
      containers: snapshot,
    }),
  ),
  final: snapshot,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateDragDropItemStateFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(
      input.items.map((i) => i.id),
      "items",
    );
    distinct(
      input.containers.map((c) => c.id),
      "containers",
    );
    work(
      input.moveCount,
      input.items.length + input.containers.length,
      "moveCount",
    );
    const ids = new Set(input.containers.map((c) => c.id));
    for (const item of input.items) {
      distinct(item.eligibleContainerIds, "items");
      if (
        !ids.has(item.containerId) ||
        item.eligibleContainerIds.some((id) => !ids.has(id)) ||
        !item.eligibleContainerIds.includes(item.containerId)
      )
        return simpleError(
          "items",
          "Initial placement and eligibility must refer to supplied containers.",
          "invalid_container_reference",
        );
    }
    for (const c of input.containers)
      if (input.items.filter((i) => i.containerId === c.id).length > c.capacity)
        return simpleError(
          "containers",
          "Initial items exceed capacity.",
          "initial_capacity_exceeded",
        );
    const random = createGeneratorRandom(input.seed, context),
      positions = new Map(input.items.map((i) => [i.id, i.containerId]));
    const snapshot = (): Snapshot[] =>
        input.containers.map((c) => ({
          id: c.id,
          itemIds: input.items
            .filter((i) => positions.get(i.id) === c.id)
            .map((i) => i.id),
        })),
      initial = snapshot();
    const events = Array.from({ length: input.moveCount }, () => {
      const item = choose(input.items, random),
        target = choose(input.containers, random),
        sourceId = positions.get(item.id);
      if (sourceId === undefined) throw new Error("Missing item placement");
      const reason =
          sourceId === target.id
            ? "same-container"
            : !item.eligibleContainerIds.includes(target.id)
              ? "ineligible"
              : input.items.filter((i) => positions.get(i.id) === target.id)
                    .length >= target.capacity
                ? "capacity"
                : "accepted",
        accepted = reason === "accepted";
      if (accepted) positions.set(item.id, target.id);
      return {
        itemId: item.id,
        label: preview(item.label, 128),
        sourceId,
        targetId: target.id,
        accepted,
        reason,
        containers: snapshot(),
      };
    });
    return toolSuccess(
      finish({
        initial,
        events,
        final: snapshot(),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const dragDropItemStateFixtureExample = {
  input: {
    items: [
      {
        id: "a",
        label: "Alpha",
        containerId: "left",
        eligibleContainerIds: ["left", "right"],
      },
      {
        id: "b",
        label: "Beta",
        containerId: "right",
        eligibleContainerIds: ["left", "right"],
      },
    ],
    containers: [
      { id: "left", capacity: 1 },
      { id: "right", capacity: 1 },
    ],
    moveCount: 2,
    seed: 42,
  },
  output: {
    initial: [
      { id: "left", itemIds: ["a"] },
      { id: "right", itemIds: ["b"] },
    ],
    events: [
      {
        itemId: "b",
        label: "Beta",
        sourceId: "right",
        targetId: "left",
        accepted: false,
        reason: "capacity",
        containers: [
          { id: "left", itemIds: ["a"] },
          { id: "right", itemIds: ["b"] },
        ],
      },
      {
        itemId: "b",
        label: "Beta",
        sourceId: "right",
        targetId: "right",
        accepted: false,
        reason: "same-container",
        containers: [
          { id: "left", itemIds: ["a"] },
          { id: "right", itemIds: ["b"] },
        ],
      },
    ],
    final: [
      { id: "left", itemIds: ["a"] },
      { id: "right", itemIds: ["b"] },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const dragDropItemStateFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/drag-drop-item-state-fixture",
  title: "Random Drag and Drop Item State Fixture Generator",
  description:
    "Generate atomic move attempts across supplied containers, checking capacities and item eligibility and retaining explicit rejected moves and inventory snapshots.",
  inputSchema,
  outputSchema,
  execute: calculateDragDropItemStateFixture,
});
export const runDragDropItemStateFixture = dragDropItemStateFixtureTool.execute;
export default dragDropItemStateFixtureTool;
