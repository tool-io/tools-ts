import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";
import { calculateBreadthFirstTraversal } from "../../graph/breadth-first-traversal/tool.js";
export type WorldPortalNetworkInput = w.WSeed & {
  readonly locations: readonly {
    readonly id: string;
    readonly grantsFlagIds: readonly string[];
  }[];
  readonly flagIds: readonly string[];
  readonly initialFlagIds: readonly string[];
  readonly start: string;
  readonly candidates: readonly {
    readonly from: string;
    readonly to: string;
    readonly requiresFlagIds: readonly string[];
  }[];
  readonly portalCount: number;
  readonly requiredLocationIds: readonly string[];
};
export type WorldPortalNetworkOutput = w.WMeta & {
  readonly portals: readonly {
    readonly from: string;
    readonly to: string;
    readonly requiresFlagIds: readonly string[];
  }[];
  readonly reachableLocationIds: readonly string[];
  readonly witnesses: readonly {
    readonly destination: string;
    readonly locations: readonly string[];
    readonly heldFlagIds: readonly string[];
  }[];
  readonly exploredStateCount: number;
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  locations: w.wArray(
    w.wObject({ id: w.wId, grantsFlagIds: w.wArray(w.wId, 6) }),
    12,
    1,
  ),
  flagIds: w.wArray(w.wId, 6),
  initialFlagIds: w.wArray(w.wId, 6),
  start: w.wId,
  candidates: w.wArray(
    w.wObject({ from: w.wId, to: w.wId, requiresFlagIds: w.wArray(w.wId, 6) }),
    24,
  ),
  portalCount: w.wInt(0, 24),
  requiredLocationIds: w.wArray(w.wId, 12),
});
export const outputSchema = w.wOutput({
  portals: w.wArray(
    w.wObject({ from: w.wId, to: w.wId, requiresFlagIds: w.wArray(w.wId, 6) }),
    24,
  ),
  reachableLocationIds: w.wArray(w.wId, 12, 1),
  witnesses: w.wArray(
    w.wObject({
      destination: w.wId,
      locations: w.wArray(w.wId, 768, 1),
      heldFlagIds: w.wArray(w.wId, 6),
    }),
    12,
  ),
  exploredStateCount: w.wInt(1, 768),
  componentCount: w.wInt(1, 12),
});
const isInput = (v: unknown): v is WorldPortalNetworkInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateWorldPortalNetwork = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<WorldPortalNetworkOutput, keyof w.WMeta> => {
      const ids = x.locations.map((l) => l.id);
      w.wUnique(ids, "locations");
      w.wUnique(x.flagIds, "flagIds");
      w.wRefs(x.initialFlagIds, x.flagIds, "initialFlagIds");
      w.wRef(x.start, ids, "start");
      w.wRefs(x.requiredLocationIds, ids, "requiredLocationIds");
      w.wLinks(ids, x.candidates, "candidates", true);
      for (const loc of x.locations)
        w.wRefs(loc.grantsFlagIds, x.flagIds, "locations");
      for (const edge of x.candidates)
        w.wRefs(edge.requiresFlagIds, x.flagIds, "candidates");
      if (x.portalCount > x.candidates.length)
        return w.wInfeasible("portalCount");
      const bits = (flags: readonly string[]): number =>
          flags.reduce((mask, id) => mask | (1 << x.flagIds.indexOf(id)), 0),
        grants = new Map(x.locations.map((l) => [l.id, bits(l.grantsFlagIds)])),
        tick = w.wBudget();
      type State = {
        key: string;
        location: string;
        mask: number;
        path: readonly string[];
      };
      const analyze = (edges: readonly (typeof x.candidates)[number][]) => {
        const initialMask = bits(x.initialFlagIds) | (grants.get(x.start) ?? 0),
          startKey = x.start + "|" + initialMask;
        const queue: State[] = [
            {
              key: startKey,
              location: x.start,
              mask: initialMask,
              path: [x.start],
            },
          ],
          seen = new Set([startKey]),
          stateEdges: w.WLink[] = [];
        for (let i = 0; i < queue.length; i++) {
          tick();
          const current = queue[i];
          for (const edge of edges) {
            if (edge.from !== current.location) continue;
            const required = bits(edge.requiresFlagIds);
            if ((current.mask & required) !== required) continue;
            const mask = current.mask | (grants.get(edge.to) ?? 0),
              key = edge.to + "|" + mask;
            stateEdges.push({ from: current.key, to: key });
            if (!seen.has(key)) {
              seen.add(key);
              queue.push({
                key,
                location: edge.to,
                mask,
                path: [...current.path, edge.to],
              });
            }
          }
        }
        const traversal = calculateBreadthFirstTraversal({
          graph: w.wGraph(
            queue.map((s) => s.key),
            stateEdges,
            true,
          ),
          start: startKey,
        });
        if (traversal.visitOrder.length !== queue.length)
          throw new Error("Expanded portal state reachability disagrees.");
        return queue;
      };
      const priorities = random.shuffle(x.candidates),
        selected: typeof priorities = [],
        states: State[] = [];
      const solve = (start: number): boolean => {
        tick();
        if (selected.length === x.portalCount) {
          const explored = analyze(selected);
          if (
            !x.requiredLocationIds.every((id) =>
              explored.some((s) => s.location === id),
            )
          )
            return false;
          states.push(...explored);
          return true;
        }
        if (priorities.length - start < x.portalCount - selected.length)
          return false;
        for (let i = start; i < priorities.length; i++) {
          selected.push(priorities[i]);
          if (solve(i + 1)) return true;
          selected.pop();
        }
        return false;
      };
      if (!solve(0)) return w.wInfeasible();
      return {
        portals: x.candidates
          .filter((p) => selected.includes(p))
          .map((p) => ({ ...p, requiresFlagIds: [...p.requiresFlagIds] })),
        reachableLocationIds: ids.filter((id) =>
          states.some((s) => s.location === id),
        ),
        witnesses: x.requiredLocationIds.map((destination) => {
          const witness = states.find((s) => s.location === destination);
          if (!witness) throw new Error("Required portal witness missing.");
          return {
            destination,
            locations: [...witness.path],
            heldFlagIds: x.flagIds.filter(
              (_, i) => (witness.mask & (1 << i)) !== 0,
            ),
          };
        }),
        exploredStateCount: states.length,
        componentCount: w.wComponents(ids, selected),
      };
    },
  );
export const worldPortalNetworkExample = {
  input: {
    locations: [
      {
        id: "a",
        grantsFlagIds: [],
      },
      {
        id: "b",
        grantsFlagIds: ["key"],
      },
      {
        id: "c",
        grantsFlagIds: [],
      },
    ],
    flagIds: ["key", "moon"],
    initialFlagIds: [],
    start: "a",
    candidates: [
      {
        from: "a",
        to: "b",
        requiresFlagIds: [],
      },
      {
        from: "b",
        to: "c",
        requiresFlagIds: ["key"],
      },
      {
        from: "a",
        to: "c",
        requiresFlagIds: ["moon"],
      },
    ],
    portalCount: 2,
    requiredLocationIds: ["c"],
    seed: 42,
  },
  output: {
    portals: [
      {
        from: "a",
        to: "b",
        requiresFlagIds: [],
      },
      {
        from: "b",
        to: "c",
        requiresFlagIds: ["key"],
      },
    ],
    reachableLocationIds: ["a", "b", "c"],
    witnesses: [
      {
        destination: "c",
        locations: ["a", "b", "c"],
        heldFlagIds: ["key"],
      },
    ],
    exploredStateCount: 3,
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  WorldPortalNetworkInput,
  WorldPortalNetworkOutput
>;
export const worldPortalNetworkTool = createModelDefinition<
  WorldPortalNetworkInput,
  WorldPortalNetworkOutput
>({
  id: "random/world-portal-network",
  title: "Random World Portal Network Generator",
  description:
    "Choose an exact fictional directed portal subset with activation solved over location-and-held-flag states. Required destinations are independently reachable, not one tour; bounded nonuniform search.",
  inputSchema,
  outputSchema,
  execute: calculateWorldPortalNetwork,
});
export const runWorldPortalNetwork = worldPortalNetworkTool.execute;
export default worldPortalNetworkTool;
