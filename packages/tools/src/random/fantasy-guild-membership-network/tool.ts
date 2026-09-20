import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FantasyGuildMembershipNetworkInput = w.WSeed & {
  readonly residentIds: readonly string[];
  readonly guilds: readonly {
    readonly id: string;
    readonly quota: number;
    readonly forbiddenResidentIds: readonly string[];
  }[];
  readonly maximumMembershipsPerResident: number;
};
export type FantasyGuildMembershipNetworkOutput = w.WMeta & {
  readonly memberships: readonly {
    readonly guildId: string;
    readonly residentId: string;
  }[];
  readonly residentCounts: readonly {
    readonly id: string;
    readonly count: number;
  }[];
  readonly guildCounts: readonly {
    readonly id: string;
    readonly count: number;
  }[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  residentIds: w.wIds,
  guilds: w.wArray(
    w.wObject({
      id: w.wId,
      quota: w.wInt(0, 16),
      forbiddenResidentIds: w.wArray(w.wId, 16),
    }),
    8,
    1,
  ),
  maximumMembershipsPerResident: w.wInt(0, 8),
});
export const outputSchema = w.wOutput({
  memberships: w.wArray(w.wObject({ guildId: w.wId, residentId: w.wId }), 128),
  residentCounts: w.wArray(
    w.wObject({ id: w.wId, count: w.wInt(0, 8) }),
    16,
    1,
  ),
  guildCounts: w.wArray(w.wObject({ id: w.wId, count: w.wInt(0, 16) }), 8, 1),
  componentCount: w.wInt(1, 24),
});
const isInput = (v: unknown): v is FantasyGuildMembershipNetworkInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFantasyGuildMembershipNetwork = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FantasyGuildMembershipNetworkOutput, keyof w.WMeta> => {
      w.wUnique(x.residentIds, "residentIds");
      w.wUnique(
        x.guilds.map((g) => g.id),
        "guilds",
      );
      for (const g of x.guilds)
        w.wRefs(g.forbiddenResidentIds, x.residentIds, "guilds");
      const slots = x.guilds.flatMap((g) =>
          Array.from({ length: g.quota }, () => g),
        ),
        memberships: { guildId: string; residentId: string }[] = [],
        tick = w.wBudget();
      if (slots.length > x.residentIds.length * x.maximumMembershipsPerResident)
        return w.wInfeasible();
      const solve = (i: number): boolean => {
        tick();
        if (i === slots.length) return true;
        const g = slots[i];
        const choices = x.residentIds.filter(
          (id) =>
            !g.forbiddenResidentIds.includes(id) &&
            !memberships.some(
              (m) => m.guildId === g.id && m.residentId === id,
            ) &&
            memberships.filter((m) => m.residentId === id).length <
              x.maximumMembershipsPerResident,
        );
        for (const residentId of random.shuffle(choices)) {
          memberships.push({ guildId: g.id, residentId });
          if (solve(i + 1)) return true;
          memberships.pop();
        }
        return false;
      };
      if (!solve(0)) return w.wInfeasible();
      const nodeIds = [
          ...x.residentIds.map((id) => "resident-" + id),
          ...x.guilds.map((g) => "guild-" + g.id),
        ],
        edges = memberships.map((m) => ({
          from: "resident-" + m.residentId,
          to: "guild-" + m.guildId,
        }));
      return {
        memberships,
        residentCounts: x.residentIds.map((id) => ({
          id,
          count: memberships.filter((m) => m.residentId === id).length,
        })),
        guildCounts: x.guilds.map((g) => ({
          id: g.id,
          count: memberships.filter((m) => m.guildId === g.id).length,
        })),
        componentCount: w.wComponents(nodeIds, edges),
      };
    },
  );
export const fantasyGuildMembershipNetworkExample = {
  input: {
    residentIds: ["ada", "ben", "cy"],
    guilds: [
      {
        id: "sailors",
        quota: 2,
        forbiddenResidentIds: ["cy"],
      },
      {
        id: "smiths",
        quota: 1,
        forbiddenResidentIds: ["ada", "ben"],
      },
    ],
    maximumMembershipsPerResident: 1,
    seed: 42,
  },
  output: {
    memberships: [
      {
        guildId: "sailors",
        residentId: "ada",
      },
      {
        guildId: "sailors",
        residentId: "ben",
      },
      {
        guildId: "smiths",
        residentId: "cy",
      },
    ],
    residentCounts: [
      {
        id: "ada",
        count: 1,
      },
      {
        id: "ben",
        count: 1,
      },
      {
        id: "cy",
        count: 1,
      },
    ],
    guildCounts: [
      {
        id: "sailors",
        count: 2,
      },
      {
        id: "smiths",
        count: 1,
      },
    ],
    componentCount: 2,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FantasyGuildMembershipNetworkInput,
  FantasyGuildMembershipNetworkOutput
>;
export const fantasyGuildMembershipNetworkTool = createModelDefinition<
  FantasyGuildMembershipNetworkInput,
  FantasyGuildMembershipNetworkOutput
>({
  id: "random/fantasy-guild-membership-network",
  title: "Random Fantasy Guild Membership Network Generator",
  description:
    "Assign fictional guild quota slots with resident caps and exclusions using bounded nonuniform bipartite search, retaining weak subgroup counts including isolated residents.",
  inputSchema,
  outputSchema,
  execute: calculateFantasyGuildMembershipNetwork,
});
export const runFantasyGuildMembershipNetwork =
  fantasyGuildMembershipNetworkTool.execute;
export default fantasyGuildMembershipNetworkTool;
