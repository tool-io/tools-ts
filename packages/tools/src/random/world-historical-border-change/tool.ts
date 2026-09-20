import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type WorldHistoricalBorderChangeInput = w.WSeed & {
  readonly regions: readonly {
    readonly id: string;
    readonly initialOwnerId: string;
  }[];
  readonly ownerIds: readonly string[];
  readonly initialBoundaries: readonly w.WLink[];
  readonly allowedBoundaries: readonly w.WLink[];
  readonly eventTypes: readonly ("transfer" | "open" | "close")[];
  readonly eventCount: number;
  readonly preserveConnectedness: boolean;
};
export type WorldHistoricalBorderChangeOutput = w.WMeta & {
  readonly events: readonly {
    readonly step: number;
    readonly type: "transfer" | "open" | "close";
    readonly from: string;
    readonly to: string;
    readonly regionId: string | null;
    readonly previousOwnerId: string | null;
    readonly newOwnerId: string | null;
  }[];
  readonly snapshots: readonly {
    readonly step: number;
    readonly regions: readonly {
      readonly id: string;
      readonly ownerId: string;
    }[];
    readonly boundaries: readonly w.WLink[];
    readonly componentCount: number;
  }[];
};
export const inputSchema = w.wInput({
  regions: w.wArray(w.wObject({ id: w.wId, initialOwnerId: w.wId }), 12, 1),
  ownerIds: w.wIds,
  initialBoundaries: w.wArray(w.wLinkSchema, 64),
  allowedBoundaries: w.wArray(w.wLinkSchema, 64),
  eventTypes: w.wArray(
    { type: "string", enum: ["transfer", "open", "close"] },
    3,
    1,
  ),
  eventCount: w.wInt(0, 16),
  preserveConnectedness: w.wBool,
});
export const outputSchema = w.wOutput({
  events: w.wArray(
    w.wObject({
      step: w.wInt(1, 16),
      type: { type: "string", enum: ["transfer", "open", "close"] },
      from: w.wId,
      to: w.wId,
      regionId: { anyOf: [w.wId, { type: "null" }] },
      previousOwnerId: { anyOf: [w.wId, { type: "null" }] },
      newOwnerId: { anyOf: [w.wId, { type: "null" }] },
    }),
    16,
  ),
  snapshots: w.wArray(
    w.wObject({
      step: w.wInt(0, 16),
      regions: w.wArray(w.wObject({ id: w.wId, ownerId: w.wId }), 12, 1),
      boundaries: w.wArray(w.wLinkSchema, 64),
      componentCount: w.wInt(1, 12),
    }),
    17,
    1,
  ),
});
const isInput = (v: unknown): v is WorldHistoricalBorderChangeInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateWorldHistoricalBorderChange = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<WorldHistoricalBorderChangeOutput, keyof w.WMeta> => {
      const ids = x.regions.map((r) => r.id);
      w.wUnique(ids, "regions");
      w.wUnique(x.ownerIds, "ownerIds");
      for (const r of x.regions)
        w.wRef(r.initialOwnerId, x.ownerIds, "regions");
      w.wLinks(ids, x.initialBoundaries, "initialBoundaries");
      w.wLinks(ids, x.allowedBoundaries, "allowedBoundaries");
      w.wUnique(x.eventTypes, "eventTypes");
      const allowedKeys = new Set(x.allowedBoundaries.map((e) => w.wKey(e)));
      if (x.initialBoundaries.some((e) => !allowedKeys.has(w.wKey(e))))
        return w.simpleError(
          "initialBoundaries",
          "Initial boundaries must be allowed candidate boundaries.",
          "invalid_initial_boundary",
        );
      if (
        x.preserveConnectedness &&
        w.wComponents(ids, x.initialBoundaries) !== 1
      )
        return w.wInfeasible("initialBoundaries");
      type Change = {
        step: number;
        type: "transfer" | "open" | "close";
        from: string;
        to: string;
        regionId: string | null;
        previousOwnerId: string | null;
        newOwnerId: string | null;
      };
      type Snapshot = {
        step: number;
        regions: { id: string; ownerId: string }[];
        boundaries: w.WLink[];
        componentCount: number;
      };
      const events: Change[] = [],
        snapshots: Snapshot[] = [],
        tick = w.wBudget();
      const capture = (
        owners: ReadonlyMap<string, string>,
        edges: readonly w.WLink[],
        step: number,
      ): Snapshot => ({
        step,
        regions: ids.map((id) => ({ id, ownerId: owners.get(id) ?? "" })),
        boundaries: edges.map((e) => ({ ...e })),
        componentCount: w.wComponents(ids, edges),
      });
      const initialOwners = new Map(
        x.regions.map((r) => [r.id, r.initialOwnerId]),
      );
      snapshots.push(capture(initialOwners, x.initialBoundaries, 0));
      const solve = (
        owners: ReadonlyMap<string, string>,
        edges: readonly w.WLink[],
      ): boolean => {
        tick();
        if (events.length === x.eventCount) return true;
        const step = events.length + 1,
          moves: Change[] = [];
        if (x.eventTypes.includes("transfer"))
          for (const edge of edges) {
            const a = owners.get(edge.from) ?? "",
              b = owners.get(edge.to) ?? "";
            if (a === b) continue;
            moves.push(
              {
                step,
                type: "transfer",
                ...edge,
                regionId: edge.from,
                previousOwnerId: a,
                newOwnerId: b,
              },
              {
                step,
                type: "transfer",
                ...edge,
                regionId: edge.to,
                previousOwnerId: b,
                newOwnerId: a,
              },
            );
          }
        const active = new Set(edges.map((e) => w.wKey(e)));
        if (x.eventTypes.includes("open"))
          for (const edge of x.allowedBoundaries)
            if (!active.has(w.wKey(edge)))
              moves.push({
                step,
                type: "open",
                ...edge,
                regionId: null,
                previousOwnerId: null,
                newOwnerId: null,
              });
        if (x.eventTypes.includes("close"))
          for (const edge of edges)
            if (
              !x.preserveConnectedness ||
              w.wComponents(
                ids,
                edges.filter((e) => w.wKey(e) !== w.wKey(edge)),
              ) === 1
            )
              moves.push({
                step,
                type: "close",
                ...edge,
                regionId: null,
                previousOwnerId: null,
                newOwnerId: null,
              });
        for (const move of random.shuffle(moves)) {
          const nextOwners = new Map(owners),
            keys = new Set(active);
          if (move.type === "transfer") {
            if (move.regionId === null || move.newOwnerId === null)
              throw new Error("Transfer witness missing.");
            nextOwners.set(move.regionId, move.newOwnerId);
          } else if (move.type === "open") keys.add(w.wKey(move));
          else keys.delete(w.wKey(move));
          const nextEdges = x.allowedBoundaries.filter((e) =>
            keys.has(w.wKey(e)),
          );
          events.push(move);
          snapshots.push(capture(nextOwners, nextEdges, step));
          if (solve(nextOwners, nextEdges)) return true;
          snapshots.pop();
          events.pop();
        }
        return false;
      };
      if (!solve(initialOwners, x.initialBoundaries)) return w.wInfeasible();
      return { events, snapshots };
    },
  );
export const worldHistoricalBorderChangeExample = {
  input: {
    regions: [
      {
        id: "a",
        initialOwnerId: "north",
      },
      {
        id: "b",
        initialOwnerId: "south",
      },
      {
        id: "c",
        initialOwnerId: "south",
      },
    ],
    ownerIds: ["north", "south"],
    initialBoundaries: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    allowedBoundaries: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
      {
        from: "a",
        to: "c",
      },
    ],
    eventTypes: ["transfer", "open"],
    eventCount: 2,
    preserveConnectedness: true,
    seed: 42,
  },
  output: {
    events: [
      {
        step: 1,
        type: "open",
        from: "a",
        to: "c",
        regionId: null,
        previousOwnerId: null,
        newOwnerId: null,
      },
      {
        step: 2,
        type: "transfer",
        from: "a",
        to: "b",
        regionId: "b",
        previousOwnerId: "south",
        newOwnerId: "north",
      },
    ],
    snapshots: [
      {
        step: 0,
        regions: [
          {
            id: "a",
            ownerId: "north",
          },
          {
            id: "b",
            ownerId: "south",
          },
          {
            id: "c",
            ownerId: "south",
          },
        ],
        boundaries: [
          {
            from: "a",
            to: "b",
          },
          {
            from: "b",
            to: "c",
          },
        ],
        componentCount: 1,
      },
      {
        step: 1,
        regions: [
          {
            id: "a",
            ownerId: "north",
          },
          {
            id: "b",
            ownerId: "south",
          },
          {
            id: "c",
            ownerId: "south",
          },
        ],
        boundaries: [
          {
            from: "a",
            to: "b",
          },
          {
            from: "b",
            to: "c",
          },
          {
            from: "a",
            to: "c",
          },
        ],
        componentCount: 1,
      },
      {
        step: 2,
        regions: [
          {
            id: "a",
            ownerId: "north",
          },
          {
            id: "b",
            ownerId: "north",
          },
          {
            id: "c",
            ownerId: "south",
          },
        ],
        boundaries: [
          {
            from: "a",
            to: "b",
          },
          {
            from: "b",
            to: "c",
          },
          {
            from: "a",
            to: "c",
          },
        ],
        componentCount: 1,
      },
    ],
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  WorldHistoricalBorderChangeInput,
  WorldHistoricalBorderChangeOutput
>;
export const worldHistoricalBorderChangeTool = createModelDefinition<
  WorldHistoricalBorderChangeInput,
  WorldHistoricalBorderChangeOutput
>({
  id: "random/world-historical-border-change",
  title: "Random World Historical Border Change Sequence Generator",
  description:
    "Simulate exact ordinal fictional border changes through real ownership transfers and allowed boundary toggles, retaining every state and witness; bounded nonuniform search, not historical or geopolitical inference.",
  inputSchema,
  outputSchema,
  execute: calculateWorldHistoricalBorderChange,
});
export const runWorldHistoricalBorderChange =
  worldHistoricalBorderChangeTool.execute;
export default worldHistoricalBorderChangeTool;
