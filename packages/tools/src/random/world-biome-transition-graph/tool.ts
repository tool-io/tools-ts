import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type WorldBiomeTransitionGraphInput = w.WSeed & {
  readonly cellIds: readonly string[];
  readonly edges: readonly w.WLink[];
  readonly biomeIds: readonly string[];
  readonly compatiblePairs: readonly w.WLink[];
  readonly requiredBiomeIds: readonly string[];
};
export type WorldBiomeTransitionGraphOutput = w.WMeta & {
  readonly cells: readonly { readonly id: string; readonly biomeId: string }[];
  readonly transitions: readonly {
    readonly from: string;
    readonly to: string;
    readonly fromBiome: string;
    readonly toBiome: string;
  }[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  cellIds: w.wArray(w.wId, 12, 1),
  edges: w.wArray(w.wLinkSchema, 64),
  biomeIds: w.wArray(w.wId, 8, 1),
  compatiblePairs: w.wArray(w.wLinkSchema, 36),
  requiredBiomeIds: w.wArray(w.wId, 8),
});
export const outputSchema = w.wOutput({
  cells: w.wArray(w.wObject({ id: w.wId, biomeId: w.wId }), 12, 1),
  transitions: w.wArray(
    w.wObject({ from: w.wId, to: w.wId, fromBiome: w.wId, toBiome: w.wId }),
    64,
  ),
  componentCount: w.wInt(1, 12),
});
const isInput = (v: unknown): v is WorldBiomeTransitionGraphInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateWorldBiomeTransitionGraph = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<WorldBiomeTransitionGraphOutput, keyof w.WMeta> => {
      w.wUnique(x.cellIds, "cellIds");
      w.wLinks(x.cellIds, x.edges, "edges");
      w.wUnique(x.biomeIds, "biomeIds");
      w.wRefs(x.requiredBiomeIds, x.biomeIds, "requiredBiomeIds");
      for (const p of x.compatiblePairs) {
        w.wRef(p.from, x.biomeIds, "compatiblePairs");
        w.wRef(p.to, x.biomeIds, "compatiblePairs");
      }
      w.wUnique(
        x.compatiblePairs.map((p) => w.wKey(p)),
        "compatiblePairs",
      );
      if (x.requiredBiomeIds.length > x.cellIds.length)
        return w.wInfeasible("requiredBiomeIds");
      const labels = new Map<string, string>(),
        tick = w.wBudget(),
        compatible = new Set(x.compatiblePairs.map((p) => w.wKey(p)));
      const solve = (i: number): boolean => {
        tick();
        const missing = x.requiredBiomeIds.filter(
          (id) => ![...labels.values()].includes(id),
        );
        if (missing.length > x.cellIds.length - i) return false;
        if (i === x.cellIds.length) return missing.length === 0;
        const cell = x.cellIds[i],
          choices = x.biomeIds.filter(
            (biome) =>
              !x.edges.some((e) => {
                const other =
                  e.from === cell ? e.to : e.to === cell ? e.from : undefined;
                const assigned =
                  other === undefined ? undefined : labels.get(other);
                return (
                  assigned !== undefined &&
                  !compatible.has(w.wKey({ from: biome, to: assigned }))
                );
              }),
          );
        for (const biome of random.shuffle(choices)) {
          labels.set(cell, biome);
          if (solve(i + 1)) return true;
          labels.delete(cell);
        }
        return false;
      };
      if (!solve(0)) return w.wInfeasible();
      return {
        cells: x.cellIds.map((id) => ({ id, biomeId: labels.get(id) ?? "" })),
        transitions: x.edges.map((e) => ({
          ...e,
          fromBiome: labels.get(e.from) ?? "",
          toBiome: labels.get(e.to) ?? "",
        })),
        componentCount: w.wComponents(x.cellIds, x.edges),
      };
    },
  );
export const worldBiomeTransitionGraphExample = {
  input: {
    cellIds: ["a", "b", "c"],
    edges: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    biomeIds: ["moss", "dune"],
    compatiblePairs: [
      {
        from: "moss",
        to: "dune",
      },
    ],
    requiredBiomeIds: ["moss", "dune"],
    seed: 42,
  },
  output: {
    cells: [
      {
        id: "a",
        biomeId: "moss",
      },
      {
        id: "b",
        biomeId: "dune",
      },
      {
        id: "c",
        biomeId: "moss",
      },
    ],
    transitions: [
      {
        from: "a",
        to: "b",
        fromBiome: "moss",
        toBiome: "dune",
      },
      {
        from: "b",
        to: "c",
        fromBiome: "dune",
        toBiome: "moss",
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
  WorldBiomeTransitionGraphInput,
  WorldBiomeTransitionGraphOutput
>;
export const worldBiomeTransitionGraphTool = createModelDefinition<
  WorldBiomeTransitionGraphInput,
  WorldBiomeTransitionGraphOutput
>({
  id: "random/world-biome-transition-graph",
  title: "Random World Biome Transition Graph Generator",
  description:
    "Assign invented biomes to a supplied cell graph with symmetric caller compatibility and required coverage through bounded nonuniform search; illustrative labels, not ecology.",
  inputSchema,
  outputSchema,
  execute: calculateWorldBiomeTransitionGraph,
});
export const runWorldBiomeTransitionGraph =
  worldBiomeTransitionGraphTool.execute;
export default worldBiomeTransitionGraphTool;
