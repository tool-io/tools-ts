import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FictionalPostalRouteNetworkInput = w.WSeed & {
  readonly nodeIds: readonly string[];
  readonly depot: string;
  readonly candidates: readonly w.WLink[];
  readonly edgeCount: number;
  readonly undeliverableCount: number;
};
export type FictionalPostalRouteNetworkOutput = w.WMeta & {
  readonly deliverableIds: readonly string[];
  readonly undeliverableIds: readonly string[];
  readonly edges: readonly w.WLink[];
  readonly reachableFromDepot: readonly string[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  nodeIds: w.wIds,
  depot: w.wId,
  candidates: w.wArray(w.wLinkSchema, 64),
  edgeCount: w.wInt(0, 64),
  undeliverableCount: w.wInt(0, 15),
});
export const outputSchema = w.wOutput({
  deliverableIds: w.wIds,
  undeliverableIds: w.wArray(w.wId, 15),
  edges: w.wArray(w.wLinkSchema, 64),
  reachableFromDepot: w.wIds,
  componentCount: w.wInt(1, 16),
});
const isInput = (v: unknown): v is FictionalPostalRouteNetworkInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalPostalRouteNetwork = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalPostalRouteNetworkOutput, keyof w.WMeta> => {
      w.wUnique(x.nodeIds, "nodeIds");
      w.wRef(x.depot, x.nodeIds, "depot");
      w.wLinks(x.nodeIds, x.candidates, "candidates");
      if (x.undeliverableCount >= x.nodeIds.length)
        return w.wInfeasible("undeliverableCount");
      const choices = random.shuffle(x.nodeIds.filter((id) => id !== x.depot)),
        isolated: string[] = [],
        tick = w.wBudget();
      const remain = (): string[] =>
        x.nodeIds.filter((id) => !isolated.includes(id));
      const links = (ids: readonly string[]): readonly w.WLink[] =>
        x.candidates.filter((e) => ids.includes(e.from) && ids.includes(e.to));
      const solve = (start: number): boolean => {
        tick();
        if (isolated.length === x.undeliverableCount) {
          const ids = remain(),
            es = links(ids);
          return (
            x.edgeCount >= ids.length - 1 &&
            x.edgeCount <= es.length &&
            w.wComponents(ids, es) === 1
          );
        }
        for (let i = start; i < choices.length; i++) {
          isolated.push(choices[i]);
          if (solve(i + 1)) return true;
          isolated.pop();
        }
        return false;
      };
      if (!solve(0)) return w.wInfeasible();
      const deliverableIds = remain(),
        edges = w.wConnected(
          deliverableIds,
          links(deliverableIds),
          x.edgeCount,
          random,
        );
      return {
        deliverableIds,
        undeliverableIds: x.nodeIds.filter((id) => isolated.includes(id)),
        edges,
        reachableFromDepot: w.wReach(deliverableIds, edges, x.depot),
        componentCount: w.wComponents(x.nodeIds, edges),
      };
    },
  );
export const fictionalPostalRouteNetworkExample = {
  input: {
    nodeIds: ["a", "b", "c"],
    depot: "a",
    candidates: [
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
    edgeCount: 1,
    undeliverableCount: 1,
    seed: 42,
  },
  output: {
    deliverableIds: ["a", "c"],
    undeliverableIds: ["b"],
    edges: [
      {
        from: "a",
        to: "c",
      },
    ],
    reachableFromDepot: ["a", "c"],
    componentCount: 2,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FictionalPostalRouteNetworkInput,
  FictionalPostalRouteNetworkOutput
>;
export const fictionalPostalRouteNetworkTool = createModelDefinition<
  FictionalPostalRouteNetworkInput,
  FictionalPostalRouteNetworkOutput
>({
  id: "random/fictional-postal-route-network",
  title: "Random Fictional Postal Route Network Generator",
  description:
    "Construct a fictional delivery graph with an exact isolated nondepot set and connected deliverable subgraph; bounded nonuniform search with BFS evidence, not real routing.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalPostalRouteNetwork,
});
export const runFictionalPostalRouteNetwork =
  fictionalPostalRouteNetworkTool.execute;
export default fictionalPostalRouteNetworkTool;
