import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateTopologicalSort } from "../../graph/topological-sort/tool.js";
import {
  fcArray,
  fcId,
  fcInput,
  fcInteger,
  fcObject,
  fcOutput,
  fcPick,
  fcRun,
  fcText,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type QuestDependencyChainInput = FcSeed & {
  readonly count: number;
  readonly objectives: readonly {
    readonly id: string;
    readonly text: string;
  }[];
  readonly rewards: readonly string[];
  readonly extraDependencyProbability: number;
};
export type QuestDependencyChainOutput = FcReplay & {
  readonly fictional: boolean;
  readonly quests: readonly {
    readonly id: string;
    readonly objectiveId: string;
    readonly text: string;
    readonly reward: string;
    readonly prerequisites: readonly string[];
  }[];
  readonly edges: readonly { readonly from: string; readonly to: string }[];
  readonly topologicalOrder: readonly string[];
};
export const inputSchema = fcInput({
  count: fcInteger(1, 32),
  objectives: fcArray(fcObject({ id: fcId, text: fcText }), 64, 1),
  rewards: fcArray(fcText, 32, 1),
  extraDependencyProbability: { type: "number", minimum: 0, maximum: 1 },
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  quests: fcArray(
    fcObject({
      id: fcId,
      objectiveId: fcId,
      text: fcText,
      reward: fcText,
      prerequisites: fcArray(fcId, 31),
    }),
    32,
    1,
  ),
  edges: fcArray(fcObject({ from: fcId, to: fcId }), 496),
  topologicalOrder: fcArray(fcId, 32, 1),
});
const isInput = (v: unknown): v is QuestDependencyChainInput =>
  matchesModelInput(v, inputSchema);
export const calculateQuestDependencyChain = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<QuestDependencyChainOutput, "randomness"> => {
      fcUnique(
        x.objectives.map((v) => v.id),
        "objectives",
      );
      if (x.count > x.objectives.length)
        simpleError(
          "count",
          "Supply enough distinct objectives for every quest.",
          "infeasible_objective_count",
        );
      const pool = [...x.objectives],
        quests = Array.from({ length: x.count }, (_, i) => {
          const objective = fcPick(pool, random);
          pool.splice(pool.indexOf(objective), 1);
          return {
            id: "quest-" + (i + 1),
            objectiveId: objective.id,
            text: objective.text,
            reward: fcPick(x.rewards, random),
            prerequisites: [] as string[],
          };
        });
      const edges: { from: string; to: string }[] = [];
      for (let to = 1; to < quests.length; to++)
        for (let from = 0; from < to; from++)
          if (from === to - 1 || random.unit() < x.extraDependencyProbability) {
            quests[to].prerequisites.push(quests[from].id);
            edges.push({ from: quests[from].id, to: quests[to].id });
          }
      const graph = Object.fromEntries(
        quests.map((q) => [
          q.id,
          edges.filter((e) => e.from === q.id).map((e) => e.to),
        ]),
      );
      return {
        fictional: true,
        quests,
        edges,
        topologicalOrder: calculateTopologicalSort({ graph }).order,
      };
    },
  );
export const questDependencyChainExample = {
  input: {
    count: 2,
    objectives: [
      { id: "map", text: "Recover the harbor map" },
      { id: "bell", text: "Locate the missing bell" },
      { id: "tower", text: "Restore the tower signal" },
    ],
    rewards: ["A silver token", "A chart of the bay"],
    extraDependencyProbability: 0.3,
    seed: 42,
  },
  output: {
    fictional: true,
    quests: [
      {
        id: "quest-1",
        objectiveId: "bell",
        text: "Locate the missing bell",
        reward: "A silver token",
        prerequisites: [],
      },
      {
        id: "quest-2",
        objectiveId: "tower",
        text: "Restore the tower signal",
        reward: "A chart of the bay",
        prerequisites: ["quest-1"],
      },
    ],
    edges: [{ from: "quest-1", to: "quest-2" }],
    topologicalOrder: ["quest-1", "quest-2"],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  QuestDependencyChainInput,
  QuestDependencyChainOutput
>;
export const questDependencyChainTool = createModelDefinition<
  QuestDependencyChainInput,
  QuestDependencyChainOutput
>({
  id: "random/quest-dependency-chain",
  title: "Random Quest Dependency Chain Generator",
  description:
    "Compose supplied fictional objectives and rewards into a mandatory quest chain with optional forward prerequisites and a verified acyclic order.",
  inputSchema,
  outputSchema,
  execute: calculateQuestDependencyChain,
});
export const runQuestDependencyChain = questDependencyChainTool.execute;
export default questDependencyChainTool;
