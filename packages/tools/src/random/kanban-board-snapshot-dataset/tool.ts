import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateCycleChecker } from "../../graph/cycle-checker/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksInteger,
  mocksBoolean,
  mocksProbability,
  mocksDistinct,
  mocksPick,
  mocksFrequencies,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type KanbanBoardSnapshotDatasetInput = {
  readonly columns: readonly {
    readonly id: string;
    readonly capacity: number;
  }[];
  readonly titles: readonly string[];
  readonly count: number;
  readonly dependencyProbability: number;
  readonly seed?: number;
};
export type KanbanBoardSnapshotDatasetOutput = {
  readonly cards: readonly {
    readonly id: string;
    readonly title: string;
    readonly columnId: string;
  }[];
  readonly columns: readonly {
    readonly id: string;
    readonly capacity: number;
    readonly count: number;
  }[];
  readonly dependencies: readonly {
    readonly from: string;
    readonly to: string;
  }[];
  readonly cycleAudit: {
    readonly hasCycle: boolean;
    readonly resolvedCount: number;
    readonly unresolvedNodes: readonly string[];
  };
  readonly randomness: GeneratorReplay;
};
export const inputSchema = mocksObject(
  {
    columns: mocksArray(
      mocksObject({
        id: mocksLabel,
        capacity: { type: "integer", minimum: 0, maximum: 128 },
      }),
      32,
      1,
    ),
    titles: mocksArray(mocksLabel, 128, 1),
    count: { type: "integer", minimum: 1, maximum: 128 },
    dependencyProbability: mocksProbability,
    seed: generatorSeedSchema,
  },
  ["columns", "titles", "count", "dependencyProbability"],
);
export const outputSchema = mocksObject({
  cards: mocksArray(
    mocksObject({ id: mocksLabel, title: mocksLabel, columnId: mocksLabel }),
    128,
    1,
  ),
  columns: mocksArray(
    mocksObject({
      id: mocksLabel,
      capacity: mocksInteger,
      count: mocksInteger,
    }),
    32,
    1,
  ),
  dependencies: mocksArray(
    mocksObject({ from: mocksLabel, to: mocksLabel }),
    8128,
  ),
  cycleAudit: mocksObject({
    hasCycle: mocksBoolean,
    resolvedCount: mocksInteger,
    unresolvedNodes: mocksArray(mocksLabel),
  }),
  randomness: generatorReplaySchema,
});
const generate = (
  input: KanbanBoardSnapshotDatasetInput,
  random: GeneratorRandom,
): Omit<KanbanBoardSnapshotDatasetOutput, "randomness"> => {
  mocksDistinct(
    input.columns.map((column) => column.id),
    "columns",
  );
  if (
    input.columns.reduce((sum, column) => sum + column.capacity, 0) <
    input.count
  )
    simpleError(
      "count",
      "Column capacities cannot contain the requested cards.",
      "infeasible_wip_capacity",
    );
  const columns = input.columns.map((column) => ({ ...column, count: 0 }));
  const cards = Array.from({ length: input.count }, (_, i) => {
    const column = mocksPick(
      columns.filter((item) => item.count < item.capacity),
      random,
    );
    column.count += 1;
    return {
      id: "card-" + (i + 1),
      title: mocksPick(input.titles, random),
      columnId: column.id,
    };
  });
  const dependencies: { from: string; to: string }[] = [];
  const graph: Record<string, string[]> = Object.fromEntries(
    cards.map((card) => [card.id, []]),
  );
  for (let i = 0; i < cards.length; i += 1)
    for (let j = i + 1; j < cards.length; j += 1)
      if (random.unit() < input.dependencyProbability) {
        dependencies.push({ from: cards[i].id, to: cards[j].id });
        graph[cards[i].id].push(cards[j].id);
      }
  const cycleAudit = calculateCycleChecker({ graph });
  if (cycleAudit.hasCycle)
    throw new Error("Ordinal-directed dependencies produced a cycle.");
  const frequencies = mocksFrequencies(cards.map((card) => card.columnId));
  for (const column of columns)
    if (
      (frequencies.find((frequency) => frequency.label === column.id)?.count ??
        0) !== column.count
    )
      throw new Error("Column frequency cross-check failed.");
  return { cards, columns, dependencies, cycleAudit };
};
export const kanbanBoardSnapshotDatasetExample = {
  input: {
    columns: [
      { id: "todo", capacity: 1 },
      { id: "doing", capacity: 2 },
      { id: "done", capacity: 2 },
    ],
    titles: ["Map", "Review"],
    count: 3,
    dependencyProbability: 0.7,
    seed: 42,
  },
  output: {
    cards: [
      { id: "card-1", title: "Map", columnId: "doing" },
      { id: "card-2", title: "Review", columnId: "done" },
      { id: "card-3", title: "Review", columnId: "todo" },
    ],
    columns: [
      { id: "todo", capacity: 1, count: 1 },
      { id: "doing", capacity: 2, count: 1 },
      { id: "done", capacity: 2, count: 1 },
    ],
    dependencies: [
      { from: "card-1", to: "card-2" },
      { from: "card-1", to: "card-3" },
    ],
    cycleAudit: { hasCycle: false, resolvedCount: 3, unresolvedNodes: [] },
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  KanbanBoardSnapshotDatasetInput,
  KanbanBoardSnapshotDatasetOutput
>;

const isInput = (input: unknown): input is KanbanBoardSnapshotDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateKanbanBoardSnapshotDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<KanbanBoardSnapshotDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const kanbanBoardSnapshotDatasetTool = createModelDefinition<
  KanbanBoardSnapshotDatasetInput,
  KanbanBoardSnapshotDatasetOutput
>({
  id: "random/kanban-board-snapshot-dataset",
  title: "Random Kanban Board Snapshot Dataset Generator",
  description:
    "Generate supplied-title synthetic cards under column work-in-progress caps with optional ordinal-directed acyclic dependencies and count summaries.",
  inputSchema,
  outputSchema,
  execute: calculateKanbanBoardSnapshotDataset,
});
export const runKanbanBoardSnapshotDataset =
  kanbanBoardSnapshotDatasetTool.execute;
export default kanbanBoardSnapshotDatasetTool;
