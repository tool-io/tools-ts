import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";
import { generatorSampleIndices } from "../generator-random.js";
import { calculateTopologicalSort } from "../../graph/topological-sort/tool.js";
export type FictionalRiverTownNetworkInput = w.WSeed & {
  readonly townIds: readonly string[];
  readonly candidates: readonly w.WLink[];
  readonly edgeCount: number;
  readonly minimumElevation: number;
  readonly maximumElevation: number;
};
export type FictionalRiverTownNetworkOutput = w.WMeta & {
  readonly towns: readonly {
    readonly id: string;
    readonly elevation: number;
    readonly upstream: readonly string[];
    readonly downstream: readonly string[];
  }[];
  readonly rivers: readonly w.WLink[];
  readonly order: readonly string[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  townIds: w.wIds,
  candidates: w.wArray(w.wLinkSchema, 64),
  edgeCount: w.wInt(0, 64),
  minimumElevation: w.wInt(-Number.MAX_SAFE_INTEGER),
  maximumElevation: w.wInt(-Number.MAX_SAFE_INTEGER),
});
export const outputSchema = w.wOutput({
  towns: w.wArray(
    w.wObject({
      id: w.wId,
      elevation: w.wInt(-Number.MAX_SAFE_INTEGER),
      upstream: w.wArray(w.wId, 15),
      downstream: w.wArray(w.wId, 15),
    }),
    16,
    1,
  ),
  rivers: w.wArray(w.wLinkSchema, 64),
  order: w.wIds,
  componentCount: w.wInt(1, 16),
});
const isInput = (v: unknown): v is FictionalRiverTownNetworkInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalRiverTownNetwork = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalRiverTownNetworkOutput, keyof w.WMeta> => {
      w.wUnique(x.townIds, "townIds");
      w.wLinks(x.townIds, x.candidates, "candidates");
      const span = x.maximumElevation - x.minimumElevation + 1;
      if (span < x.townIds.length) return w.wInfeasible("maximumElevation");
      if (!Number.isSafeInteger(span) || span <= 0)
        return w.simpleError(
          "maximumElevation",
          "Ordinal range is not representable as a safe discrete population.",
          "numeric_overflow",
        );
      const edges = w.wConnected(x.townIds, x.candidates, x.edgeCount, random);
      const offsets = generatorSampleIndices(span, x.townIds.length, random),
        height = new Map(
          x.townIds.map((id, i) => [id, x.minimumElevation + offsets[i]]),
        );
      const rivers = edges.map((e) =>
        (height.get(e.from) ?? 0) > (height.get(e.to) ?? 0)
          ? e
          : { from: e.to, to: e.from },
      );
      const reverse = rivers.map((e) => ({ from: e.to, to: e.from }));
      return {
        towns: x.townIds.map((id) => ({
          id,
          elevation: height.get(id) ?? 0,
          upstream: w
            .wReach(x.townIds, reverse, id, true)
            .filter((n) => n !== id),
          downstream: w
            .wReach(x.townIds, rivers, id, true)
            .filter((n) => n !== id),
        })),
        rivers,
        order: calculateTopologicalSort({
          graph: w.wGraph(x.townIds, rivers, true),
        }).order,
        componentCount: w.wComponents(x.townIds, rivers),
      };
    },
  );
export const fictionalRiverTownNetworkExample = {
  input: {
    townIds: ["a", "b", "c"],
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
    minimumElevation: 10,
    maximumElevation: 12,
    seed: 42,
  },
  output: {
    towns: [
      {
        id: "a",
        elevation: 11,
        upstream: ["b"],
        downstream: [],
      },
      {
        id: "b",
        elevation: 12,
        upstream: [],
        downstream: ["a", "c"],
      },
      {
        id: "c",
        elevation: 10,
        upstream: ["b"],
        downstream: [],
      },
    ],
    rivers: [
      {
        from: "b",
        to: "a",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    order: ["b", "a", "c"],
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FictionalRiverTownNetworkInput,
  FictionalRiverTownNetworkOutput
>;
export const fictionalRiverTownNetworkTool = createModelDefinition<
  FictionalRiverTownNetworkInput,
  FictionalRiverTownNetworkOutput
>({
  id: "random/fictional-river-town-network",
  title: "Random Fictional River Town Network Generator",
  description:
    "Construct a connected fictional settlement graph with distinct ordinal elevations and strictly descending river edges, retaining upstream/downstream reachability; not hydrology.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalRiverTownNetwork,
});
export const runFictionalRiverTownNetwork =
  fictionalRiverTownNetworkTool.execute;
export default fictionalRiverTownNetworkTool;
