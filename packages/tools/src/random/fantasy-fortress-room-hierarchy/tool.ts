import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FantasyFortressRoomHierarchyInput = w.WSeed & {
  readonly rooms: readonly {
    readonly id: string;
    readonly roleId: string;
    readonly zoneId: string;
    readonly accessTags: readonly string[];
  }[];
  readonly root: string;
  readonly allowedRolePairs: readonly w.WLink[];
  readonly gatewayRoleIds: readonly string[];
  readonly maximumChildren: number;
  readonly maximumDepth: number;
};
export type FantasyFortressRoomHierarchyOutput = w.WMeta & {
  readonly rooms: readonly {
    readonly id: string;
    readonly roleId: string;
    readonly zoneId: string;
    readonly accessTags: readonly string[];
    readonly level: number;
  }[];
  readonly parentLinks: readonly w.WLink[];
  readonly zoneCounts: readonly {
    readonly id: string;
    readonly count: number;
  }[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  rooms: w.wArray(
    w.wObject({
      id: w.wId,
      roleId: w.wId,
      zoneId: w.wId,
      accessTags: w.wArray(w.wId, 16),
    }),
    12,
    1,
  ),
  root: w.wId,
  allowedRolePairs: w.wArray(w.wLinkSchema, 64),
  gatewayRoleIds: w.wArray(w.wId, 12),
  maximumChildren: w.wInt(0, 11),
  maximumDepth: w.wInt(0, 11),
});
export const outputSchema = w.wOutput({
  rooms: w.wArray(
    w.wObject({
      id: w.wId,
      roleId: w.wId,
      zoneId: w.wId,
      accessTags: w.wArray(w.wId, 16),
      level: w.wInt(0, 11),
    }),
    12,
    1,
  ),
  parentLinks: w.wArray(w.wLinkSchema, 11),
  zoneCounts: w.wArray(w.wObject({ id: w.wId, count: w.wInt(1, 12) }), 12, 1),
  componentCount: w.wInt(1, 1),
});
const isInput = (v: unknown): v is FantasyFortressRoomHierarchyInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFantasyFortressRoomHierarchy = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FantasyFortressRoomHierarchyOutput, keyof w.WMeta> => {
      const ids = x.rooms.map((r) => r.id),
        roles = [...new Set(x.rooms.map((r) => r.roleId))];
      w.wUnique(ids, "rooms");
      w.wRef(x.root, ids, "root");
      w.wRefs(x.gatewayRoleIds, roles, "gatewayRoleIds");
      for (const room of x.rooms) w.wUnique(room.accessTags, "rooms");
      for (const pair of x.allowedRolePairs) {
        w.wRef(pair.from, roles, "allowedRolePairs");
        w.wRef(pair.to, roles, "allowedRolePairs");
      }
      w.wUnique(
        x.allowedRolePairs.map((p) => w.wKey(p, true)),
        "allowedRolePairs",
      );
      const levels = new Map<string, number>([[x.root, 0]]),
        parentLinks: w.WLink[] = [],
        tick = w.wBudget(),
        allowed = new Set(x.allowedRolePairs.map((p) => w.wKey(p, true)));
      const solve = (): boolean => {
        tick();
        if (levels.size === ids.length) return true;
        const choices: w.WLink[] = [];
        for (const parent of x.rooms) {
          if (
            !levels.has(parent.id) ||
            (levels.get(parent.id) ?? 0) >= x.maximumDepth ||
            parentLinks.filter((e) => e.from === parent.id).length >=
              x.maximumChildren
          )
            continue;
          for (const child of x.rooms) {
            if (
              levels.has(child.id) ||
              !allowed.has(
                w.wKey({ from: parent.roleId, to: child.roleId }, true),
              ) ||
              (parent.zoneId !== child.zoneId &&
                !x.gatewayRoleIds.includes(parent.roleId))
            )
              continue;
            choices.push({ from: parent.id, to: child.id });
          }
        }
        for (const edge of random.shuffle(choices)) {
          parentLinks.push(edge);
          levels.set(edge.to, (levels.get(edge.from) ?? 0) + 1);
          if (solve()) return true;
          levels.delete(edge.to);
          parentLinks.pop();
        }
        return false;
      };
      if (!solve()) return w.wInfeasible();
      const zones = [...new Set(x.rooms.map((r) => r.zoneId))];
      return {
        rooms: x.rooms.map((r) => ({
          ...r,
          accessTags: [...r.accessTags],
          level: levels.get(r.id) ?? 0,
        })),
        parentLinks,
        zoneCounts: zones.map((id) => ({
          id,
          count: x.rooms.filter((r) => r.zoneId === id).length,
        })),
        componentCount: w.wComponents(ids, parentLinks),
      };
    },
  );
export const fantasyFortressRoomHierarchyExample = {
  input: {
    rooms: [
      {
        id: "r",
        roleId: "hall",
        zoneId: "keep",
        accessTags: ["public"],
      },
      {
        id: "a",
        roleId: "armory",
        zoneId: "keep",
        accessTags: ["staff"],
      },
      {
        id: "b",
        roleId: "tower",
        zoneId: "wall",
        accessTags: ["guard"],
      },
    ],
    root: "r",
    allowedRolePairs: [
      {
        from: "hall",
        to: "armory",
      },
      {
        from: "hall",
        to: "tower",
      },
    ],
    gatewayRoleIds: ["hall"],
    maximumChildren: 2,
    maximumDepth: 1,
    seed: 42,
  },
  output: {
    rooms: [
      {
        id: "r",
        roleId: "hall",
        zoneId: "keep",
        accessTags: ["public"],
        level: 0,
      },
      {
        id: "a",
        roleId: "armory",
        zoneId: "keep",
        accessTags: ["staff"],
        level: 1,
      },
      {
        id: "b",
        roleId: "tower",
        zoneId: "wall",
        accessTags: ["guard"],
        level: 1,
      },
    ],
    parentLinks: [
      {
        from: "r",
        to: "a",
      },
      {
        from: "r",
        to: "b",
      },
    ],
    zoneCounts: [
      {
        id: "keep",
        count: 2,
      },
      {
        id: "wall",
        count: 1,
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
  FantasyFortressRoomHierarchyInput,
  FantasyFortressRoomHierarchyOutput
>;
export const fantasyFortressRoomHierarchyTool = createModelDefinition<
  FantasyFortressRoomHierarchyInput,
  FantasyFortressRoomHierarchyOutput
>({
  id: "random/fantasy-fortress-room-hierarchy",
  title: "Random Fantasy Fortress Room Hierarchy Generator",
  description:
    "Construct a rooted fictional room tree with caller role transitions, cross-zone gateway roles and child/depth caps while preserving access tags; bounded nonuniform search, no security certification.",
  inputSchema,
  outputSchema,
  execute: calculateFantasyFortressRoomHierarchy,
});
export const runFantasyFortressRoomHierarchy =
  fantasyFortressRoomHierarchyTool.execute;
export default fantasyFortressRoomHierarchyTool;
