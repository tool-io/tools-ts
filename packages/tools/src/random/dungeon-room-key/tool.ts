import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateShortestUnweightedPath } from "../../graph/shortest-unweighted-path/tool.js";
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
import { fcGraph, fcGraphEvidence } from "../m250-fiction-craft-graph.js";
export type DungeonRoomKeyInput = FcSeed & {
  readonly rooms: readonly { readonly id: string; readonly name: string }[];
  readonly doors: readonly {
    readonly from: string;
    readonly to: string;
    readonly keyId: string | null;
  }[];
  readonly keyIds: readonly string[];
  readonly startRoomId: string;
  readonly requiredRoomIds: readonly string[];
  readonly contents: readonly string[];
  readonly clues: readonly string[];
};
export type DungeonRoomKeyOutput = FcReplay & {
  readonly fictional: boolean;
  readonly rooms: readonly {
    readonly id: string;
    readonly name: string;
    readonly contents: string;
    readonly clue: string;
    readonly keys: readonly string[];
  }[];
  readonly stages: readonly {
    readonly keyId: string | null;
    readonly keyRoomId: string | null;
    readonly reachableRooms: readonly string[];
  }[];
  readonly paths: readonly {
    readonly target: string;
    readonly distance: number;
    readonly rooms: readonly string[];
  }[];
  readonly components: number;
};
const nullableId = { anyOf: [fcId, { type: "null" }] } as const;
export const inputSchema = fcInput({
  rooms: fcArray(fcObject({ id: fcId, name: fcText }), 24, 1),
  doors: fcArray(fcObject({ from: fcId, to: fcId, keyId: nullableId }), 64),
  keyIds: fcArray(fcId, 12),
  startRoomId: fcId,
  requiredRoomIds: fcArray(fcId, 24),
  contents: fcArray(fcText, 32, 1),
  clues: fcArray(fcText, 32, 1),
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  rooms: fcArray(
    fcObject({
      id: fcId,
      name: fcText,
      contents: fcText,
      clue: fcText,
      keys: fcArray(fcId, 12),
    }),
    24,
    1,
  ),
  stages: fcArray(
    fcObject({
      keyId: nullableId,
      keyRoomId: nullableId,
      reachableRooms: fcArray(fcId, 24, 1),
    }),
    13,
    1,
  ),
  paths: fcArray(
    fcObject({
      target: fcId,
      distance: fcInteger(0, 23),
      rooms: fcArray(fcId, 24, 1),
    }),
    24,
  ),
  components: fcInteger(1, 24),
});
const isInput = (v: unknown): v is DungeonRoomKeyInput =>
  matchesModelInput(v, inputSchema);
export const calculateDungeonRoomKey = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<DungeonRoomKeyOutput, "randomness"> => {
      const ids = x.rooms.map((r) => r.id);
      fcUnique(ids, "rooms");
      fcUnique(x.keyIds, "keyIds");
      fcUnique(x.requiredRoomIds, "requiredRoomIds");
      if (
        !ids.includes(x.startRoomId) ||
        x.requiredRoomIds.some((id) => !ids.includes(id)) ||
        x.doors.some(
          (d) =>
            !ids.includes(d.from) ||
            !ids.includes(d.to) ||
            d.from === d.to ||
            (d.keyId !== null && !x.keyIds.includes(d.keyId)),
        )
      )
        simpleError(
          "doors",
          "Room and key references must exist, and doors must join distinct rooms.",
          "invalid_reference",
        );
      fcUnique(
        x.doors.map((d) => [d.from, d.to].sort().join("|")),
        "doors",
      );
      const allEdges = x.doors.map((d) => ({
          a: ids.indexOf(d.from),
          b: ids.indexOf(d.to),
        })),
        fullGraph = fcGraph(ids, allEdges);
      for (const target of x.requiredRoomIds)
        if (
          !calculateShortestUnweightedPath({
            graph: fullGraph,
            source: x.startRoomId,
            target,
          }).found
        )
          simpleError(
            "requiredRoomIds",
            "A required room is disconnected even with all doors unlocked.",
            "unreachable_room",
          );
      const acquired = new Set<string>(),
        placement = new Map<string, string>();
      const reachable = (): string[] => {
        const edges = x.doors
            .filter((d) => d.keyId === null || acquired.has(d.keyId))
            .map((d) => ({ a: ids.indexOf(d.from), b: ids.indexOf(d.to) })),
          graph = fcGraph(ids, edges);
        return ids
          .filter(
            (target) =>
              calculateShortestUnweightedPath({
                graph,
                source: x.startRoomId,
                target,
              }).found,
          )
          .sort();
      };
      let reached = reachable();
      const stages: DungeonRoomKeyOutput["stages"][number][] = [
        { keyId: null, keyRoomId: null, reachableRooms: reached },
      ];
      while (acquired.size < x.keyIds.length) {
        const remaining = x.keyIds.filter((id) => !acquired.has(id));
        const frontier = remaining.filter((id) =>
          x.doors.some(
            (d) =>
              d.keyId === id &&
              (reached.includes(d.from) || reached.includes(d.to)),
          ),
        );
        const keyId = fcPick(frontier.length ? frontier : remaining, random),
          keyRoomId = fcPick(reached, random);
        placement.set(keyId, keyRoomId);
        acquired.add(keyId);
        reached = reachable();
        stages.push({ keyId, keyRoomId, reachableRooms: reached });
      }
      const rooms = x.rooms.map((r) => ({
        ...r,
        contents: fcPick(x.contents, random),
        clue: fcPick(x.clues, random),
        keys: x.keyIds.filter((id) => placement.get(id) === r.id),
      }));
      const paths = x.requiredRoomIds.map((target) => {
        const path = calculateShortestUnweightedPath({
          graph: fullGraph,
          source: x.startRoomId,
          target,
        });
        return { target, distance: path.distance, rooms: path.path };
      });
      return {
        fictional: true,
        rooms,
        stages,
        paths,
        components: fcGraphEvidence(ids, allEdges).components,
      };
    },
  );
export const dungeonRoomKeyExample = {
  input: {
    rooms: [
      { id: "foyer", name: "Entry Hall" },
      { id: "vault", name: "Lantern Vault" },
      { id: "gallery", name: "Map Gallery" },
    ],
    doors: [
      { from: "foyer", to: "vault", keyId: "brass" },
      { from: "foyer", to: "gallery", keyId: null },
    ],
    keyIds: ["brass"],
    startRoomId: "foyer",
    requiredRoomIds: ["vault"],
    contents: ["Stacked crates", "Stone benches"],
    clues: ["A cold draft", "Chalk marks"],
    seed: 42,
  },
  output: {
    fictional: true,
    rooms: [
      {
        id: "foyer",
        name: "Entry Hall",
        contents: "Stone benches",
        clue: "Chalk marks",
        keys: ["brass"],
      },
      {
        id: "vault",
        name: "Lantern Vault",
        contents: "Stacked crates",
        clue: "Chalk marks",
        keys: [],
      },
      {
        id: "gallery",
        name: "Map Gallery",
        contents: "Stacked crates",
        clue: "Chalk marks",
        keys: [],
      },
    ],
    stages: [
      { keyId: null, keyRoomId: null, reachableRooms: ["foyer", "gallery"] },
      {
        keyId: "brass",
        keyRoomId: "foyer",
        reachableRooms: ["foyer", "gallery", "vault"],
      },
    ],
    paths: [{ target: "vault", distance: 1, rooms: ["foyer", "vault"] }],
    components: 1,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<DungeonRoomKeyInput, DungeonRoomKeyOutput>;
export const dungeonRoomKeyTool = createModelDefinition<
  DungeonRoomKeyInput,
  DungeonRoomKeyOutput
>({
  id: "random/dungeon-room-key",
  title: "Random Dungeon Room Key Generator",
  description:
    "Populate a supplied fictional dungeon with contents, clues, and reusable keys placed in reachable rooms, recording unlock stages and required-room paths.",
  inputSchema,
  outputSchema,
  execute: calculateDungeonRoomKey,
});
export const runDungeonRoomKey = dungeonRoomKeyTool.execute;
export default dungeonRoomKeyTool;
