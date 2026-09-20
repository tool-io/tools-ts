import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FictionalMigrationStoryMapInput = w.WSeed & {
  readonly nodeIds: readonly string[];
  readonly travel: readonly w.WLink[];
  readonly groups: readonly {
    readonly id: string;
    readonly startNodeId: string;
  }[];
  readonly stopCount: number;
  readonly noRepeat: boolean;
  readonly eventHooks: readonly {
    readonly id: string;
    readonly text: string;
  }[];
};
export type FictionalMigrationStoryMapOutput = w.WMeta & {
  readonly journeys: readonly {
    readonly groupId: string;
    readonly stops: readonly {
      readonly number: number;
      readonly nodeId: string;
      readonly hookId: string;
      readonly hookText: string;
    }[];
  }[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  nodeIds: w.wIds,
  travel: w.wArray(w.wLinkSchema, 64),
  groups: w.wArray(w.wObject({ id: w.wId, startNodeId: w.wId }), 8, 1),
  stopCount: w.wInt(1, 32),
  noRepeat: w.wBool,
  eventHooks: w.wArray(w.wObject({ id: w.wId, text: w.wText }), 16, 1),
});
export const outputSchema = w.wOutput({
  journeys: w.wArray(
    w.wObject({
      groupId: w.wId,
      stops: w.wArray(
        w.wObject({
          number: w.wInt(1, 32),
          nodeId: w.wId,
          hookId: w.wId,
          hookText: w.wText,
        }),
        32,
        1,
      ),
    }),
    8,
    1,
  ),
  componentCount: w.wInt(1, 16),
});
const isInput = (v: unknown): v is FictionalMigrationStoryMapInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalMigrationStoryMap = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalMigrationStoryMapOutput, keyof w.WMeta> => {
      w.wUnique(x.nodeIds, "nodeIds");
      w.wLinks(x.nodeIds, x.travel, "travel");
      w.wUnique(
        x.groups.map((g) => g.id),
        "groups",
      );
      w.wUnique(
        x.eventHooks.map((h) => h.id),
        "eventHooks",
      );
      for (const g of x.groups) w.wRef(g.startNodeId, x.nodeIds, "groups");
      if (x.noRepeat && x.stopCount > x.nodeIds.length)
        return w.wInfeasible("stopCount");
      const tick = w.wBudget();
      const journeys = x.groups.map((group) => {
        const path = [group.startNodeId];
        const solve = (): boolean => {
          tick();
          if (path.length === x.stopCount) return true;
          const last = path[path.length - 1],
            choices = x.travel
              .flatMap((e) =>
                e.from === last ? [e.to] : e.to === last ? [e.from] : [],
              )
              .filter((id) => !x.noRepeat || !path.includes(id));
          for (const id of random.shuffle(choices)) {
            path.push(id);
            if (solve()) return true;
            path.pop();
          }
          return false;
        };
        if (!solve()) return w.wInfeasible();
        return {
          groupId: group.id,
          stops: path.map((nodeId, i) => {
            const hook = random.pick(x.eventHooks);
            return {
              number: i + 1,
              nodeId,
              hookId: hook.id,
              hookText: hook.text,
            };
          }),
        };
      });
      return { journeys, componentCount: w.wComponents(x.nodeIds, x.travel) };
    },
  );
export const fictionalMigrationStoryMapExample = {
  input: {
    nodeIds: ["a", "b", "c"],
    travel: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    groups: [
      {
        id: "g",
        startNodeId: "a",
      },
    ],
    stopCount: 3,
    noRepeat: true,
    eventHooks: [
      {
        id: "arrive",
        text: "Arrive",
      },
      {
        id: "depart",
        text: "Depart",
      },
    ],
    seed: 42,
  },
  output: {
    journeys: [
      {
        groupId: "g",
        stops: [
          {
            number: 1,
            nodeId: "a",
            hookId: "depart",
            hookText: "Depart",
          },
          {
            number: 2,
            nodeId: "b",
            hookId: "arrive",
            hookText: "Arrive",
          },
          {
            number: 3,
            nodeId: "c",
            hookId: "depart",
            hookText: "Depart",
          },
        ],
      },
    ],
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FictionalMigrationStoryMapInput,
  FictionalMigrationStoryMapOutput
>;
export const fictionalMigrationStoryMapTool = createModelDefinition<
  FictionalMigrationStoryMapInput,
  FictionalMigrationStoryMapOutput
>({
  id: "random/fictional-migration-story-map",
  title: "Random Fictional Migration Story Map Generator",
  description:
    "Construct exact fictional group walks over caller travel links, with optional distinct stops and supplied event hooks; bounded nonuniform path search, no demographic prediction.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalMigrationStoryMap,
});
export const runFictionalMigrationStoryMap =
  fictionalMigrationStoryMapTool.execute;
export default fictionalMigrationStoryMapTool;
