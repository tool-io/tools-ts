import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FantasyTradeRouteNetworkInput = w.WSeed & {
  readonly markets: readonly {
    readonly id: string;
    readonly commodityIds: readonly string[];
  }[];
  readonly candidates: readonly w.WLink[];
  readonly edgeCount: number;
  readonly minimumCapacity: number;
  readonly maximumCapacity: number;
};
export type FantasyTradeRouteNetworkOutput = w.WMeta & {
  readonly routes: readonly {
    readonly from: string;
    readonly to: string;
    readonly commodityId: string;
    readonly capacity: number;
  }[];
  readonly totalCapacity: number;
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  markets: w.wArray(
    w.wObject({ id: w.wId, commodityIds: w.wArray(w.wId, 16, 1) }),
    16,
    1,
  ),
  candidates: w.wArray(w.wLinkSchema, 64),
  edgeCount: w.wInt(0, 64),
  minimumCapacity: w.wInt(0, 1000000),
  maximumCapacity: w.wInt(0, 1000000),
});
export const outputSchema = w.wOutput({
  routes: w.wArray(
    w.wObject({
      from: w.wId,
      to: w.wId,
      commodityId: w.wId,
      capacity: w.wInt(),
    }),
    64,
  ),
  totalCapacity: w.wInt(),
  componentCount: w.wInt(1, 16),
});
const isInput = (v: unknown): v is FantasyTradeRouteNetworkInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFantasyTradeRouteNetwork = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FantasyTradeRouteNetworkOutput, keyof w.WMeta> => {
      const ids = x.markets.map((m) => m.id);
      w.wUnique(ids, "markets");
      w.wLinks(ids, x.candidates, "candidates");
      for (const m of x.markets) w.wUnique(m.commodityIds, "markets");
      if (x.minimumCapacity > x.maximumCapacity)
        return w.wInfeasible("maximumCapacity");
      const goods = new Map(x.markets.map((m) => [m.id, m.commodityIds]));
      const shared = (e: w.WLink) =>
        (goods.get(e.from) ?? []).filter((c) => goods.get(e.to)?.includes(c));
      const edges = w.wConnected(
        ids,
        x.candidates.filter((e) => shared(e).length > 0),
        x.edgeCount,
        random,
      );
      const routes = edges.map((e) => ({
        ...e,
        commodityId: random.pick(shared(e)),
        capacity: random.integer(x.minimumCapacity, x.maximumCapacity),
      }));
      return {
        routes,
        totalCapacity: routes.reduce((sum, r) => sum + r.capacity, 0),
        componentCount: w.wComponents(ids, routes),
      };
    },
  );
export const fantasyTradeRouteNetworkExample = {
  input: {
    markets: [
      {
        id: "a",
        commodityIds: ["salt"],
      },
      {
        id: "b",
        commodityIds: ["salt", "grain"],
      },
      {
        id: "c",
        commodityIds: ["grain"],
      },
    ],
    candidates: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    edgeCount: 2,
    minimumCapacity: 2,
    maximumCapacity: 5,
    seed: 42,
  },
  output: {
    routes: [
      {
        from: "a",
        to: "b",
        commodityId: "salt",
        capacity: 5,
      },
      {
        from: "b",
        to: "c",
        commodityId: "grain",
        capacity: 2,
      },
    ],
    totalCapacity: 7,
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FantasyTradeRouteNetworkInput,
  FantasyTradeRouteNetworkOutput
>;
export const fantasyTradeRouteNetworkTool = createModelDefinition<
  FantasyTradeRouteNetworkInput,
  FantasyTradeRouteNetworkOutput
>({
  id: "random/fantasy-trade-route-network",
  title: "Random Fantasy Trade Route Network Generator",
  description:
    "Construct connected fictional commodity-compatible market routes and draw explicit link capacities; nonuniform topology, no price, flow, or economic predictions.",
  inputSchema,
  outputSchema,
  execute: calculateFantasyTradeRouteNetwork,
});
export const runFantasyTradeRouteNetwork = fantasyTradeRouteNetworkTool.execute;
export default fantasyTradeRouteNetworkTool;
