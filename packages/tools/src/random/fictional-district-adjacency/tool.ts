import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FictionalDistrictAdjacencyInput = w.WSeed & {
  readonly districts: readonly {
    readonly id: string;
    readonly allowedLandUses: readonly string[];
  }[];
  readonly boundaries: readonly w.WLink[];
  readonly prohibitedLandUsePairs: readonly w.WLink[];
  readonly edgeCount: number;
};
export type FictionalDistrictAdjacencyOutput = w.WMeta & {
  readonly districts: readonly {
    readonly id: string;
    readonly landUse: string;
  }[];
  readonly edges: readonly w.WLink[];
  readonly rejectedBoundaries: readonly w.WLink[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  districts: w.wArray(
    w.wObject({ id: w.wId, allowedLandUses: w.wArray(w.wId, 4, 1) }),
    12,
    1,
  ),
  boundaries: w.wArray(w.wLinkSchema, 64),
  prohibitedLandUsePairs: w.wArray(w.wLinkSchema, 64),
  edgeCount: w.wInt(0, 64),
});
export const outputSchema = w.wOutput({
  districts: w.wArray(w.wObject({ id: w.wId, landUse: w.wId }), 12, 1),
  edges: w.wArray(w.wLinkSchema, 64),
  rejectedBoundaries: w.wArray(w.wLinkSchema, 64),
  componentCount: w.wInt(1, 12),
});
const isInput = (v: unknown): v is FictionalDistrictAdjacencyInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalDistrictAdjacency = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalDistrictAdjacencyOutput, keyof w.WMeta> => {
      const ids = x.districts.map((d) => d.id);
      w.wUnique(ids, "districts");
      w.wLinks(ids, x.boundaries, "boundaries");
      const tags = [...new Set(x.districts.flatMap((d) => d.allowedLandUses))];
      for (const d of x.districts) w.wUnique(d.allowedLandUses, "districts");
      for (const pair of x.prohibitedLandUsePairs) {
        w.wRef(pair.from, tags, "prohibitedLandUsePairs");
        w.wRef(pair.to, tags, "prohibitedLandUsePairs");
      }
      w.wUnique(
        x.prohibitedLandUsePairs.map((p) => w.wKey(p)),
        "prohibitedLandUsePairs",
      );
      const labels = new Map<string, string>(),
        tick = w.wBudget();
      const allowed = (e: w.WLink): boolean =>
        !x.prohibitedLandUsePairs.some(
          (p) =>
            w.wKey(p) ===
            w.wKey({
              from: labels.get(e.from) ?? "",
              to: labels.get(e.to) ?? "",
            }),
        );
      const solve = (i: number): boolean => {
        tick();
        if (i === ids.length) {
          const candidates = x.boundaries.filter(allowed);
          return (
            candidates.length >= x.edgeCount &&
            x.edgeCount >= ids.length - 1 &&
            w.wComponents(ids, candidates) === 1
          );
        }
        for (const label of random.shuffle(x.districts[i].allowedLandUses)) {
          labels.set(ids[i], label);
          if (solve(i + 1)) return true;
        }
        labels.delete(ids[i]);
        return false;
      };
      if (!solve(0)) return w.wInfeasible();
      const candidates = x.boundaries.filter(allowed),
        edges = w.wConnected(ids, candidates, x.edgeCount, random);
      return {
        districts: ids.map((id) => ({ id, landUse: labels.get(id) ?? "" })),
        edges,
        rejectedBoundaries: x.boundaries
          .filter((e) => !allowed(e))
          .map((e) => ({ ...e })),
        componentCount: w.wComponents(ids, edges),
      };
    },
  );
export const fictionalDistrictAdjacencyExample = {
  input: {
    districts: [
      {
        id: "grove",
        allowedLandUses: ["homes"],
      },
      {
        id: "quay",
        allowedLandUses: ["market"],
      },
      {
        id: "square",
        allowedLandUses: ["park"],
      },
    ],
    boundaries: [
      {
        from: "grove",
        to: "quay",
      },
      {
        from: "quay",
        to: "square",
      },
      {
        from: "grove",
        to: "square",
      },
    ],
    prohibitedLandUsePairs: [
      {
        from: "homes",
        to: "park",
      },
    ],
    edgeCount: 2,
    seed: 42,
  },
  output: {
    districts: [
      {
        id: "grove",
        landUse: "homes",
      },
      {
        id: "quay",
        landUse: "market",
      },
      {
        id: "square",
        landUse: "park",
      },
    ],
    edges: [
      {
        from: "grove",
        to: "quay",
      },
      {
        from: "quay",
        to: "square",
      },
    ],
    rejectedBoundaries: [
      {
        from: "grove",
        to: "square",
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
  FictionalDistrictAdjacencyInput,
  FictionalDistrictAdjacencyOutput
>;
export const fictionalDistrictAdjacencyTool = createModelDefinition<
  FictionalDistrictAdjacencyInput,
  FictionalDistrictAdjacencyOutput
>({
  id: "random/fictional-district-adjacency",
  title: "Random Fictional District Adjacency Map Generator",
  description:
    "Construct a connected fictional district graph under supplied land-use and boundary exclusions using bounded, nonuniform constraint search; no zoning or geometry claims.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalDistrictAdjacency,
});
export const runFictionalDistrictAdjacency =
  fictionalDistrictAdjacencyTool.execute;
export default fictionalDistrictAdjacencyTool;
