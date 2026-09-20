import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FictionalIslandArchipelagoNetworkInput = w.WSeed & {
  readonly islands: readonly {
    readonly id: string;
    readonly availableModeIds: readonly string[];
  }[];
  readonly candidates: readonly w.WLink[];
  readonly edgeCount: number;
  readonly connected: boolean;
};
export type FictionalIslandArchipelagoNetworkOutput = w.WMeta & {
  readonly islands: readonly {
    readonly id: string;
    readonly availableModeIds: readonly string[];
  }[];
  readonly links: readonly {
    readonly from: string;
    readonly to: string;
    readonly modeId: string;
  }[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  islands: w.wArray(
    w.wObject({ id: w.wId, availableModeIds: w.wArray(w.wId, 8, 1) }),
    16,
    1,
  ),
  candidates: w.wArray(w.wLinkSchema, 64),
  edgeCount: w.wInt(0, 64),
  connected: w.wBool,
});
export const outputSchema = w.wOutput({
  islands: w.wArray(
    w.wObject({ id: w.wId, availableModeIds: w.wArray(w.wId, 8, 1) }),
    16,
    1,
  ),
  links: w.wArray(w.wObject({ from: w.wId, to: w.wId, modeId: w.wId }), 64),
  componentCount: w.wInt(1, 16),
});
const isInput = (v: unknown): v is FictionalIslandArchipelagoNetworkInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalIslandArchipelagoNetwork = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (
      x,
      random,
    ): Omit<FictionalIslandArchipelagoNetworkOutput, keyof w.WMeta> => {
      const ids = x.islands.map((i) => i.id);
      w.wUnique(ids, "islands");
      w.wLinks(ids, x.candidates, "candidates");
      for (const i of x.islands) w.wUnique(i.availableModeIds, "islands");
      const modes = new Map(x.islands.map((i) => [i.id, i.availableModeIds])),
        shared = (e: w.WLink): readonly string[] =>
          (modes.get(e.from) ?? []).filter((id) =>
            modes.get(e.to)?.includes(id),
          );
      const eligible = x.candidates.filter((e) => shared(e).length > 0);
      if (x.edgeCount > eligible.length) return w.wInfeasible("edgeCount");
      const edges = x.connected
        ? w.wConnected(ids, eligible, x.edgeCount, random)
        : random.shuffle(eligible).slice(0, x.edgeCount);
      const links = edges.map((e) => ({
        ...e,
        modeId: random.pick(shared(e)),
      }));
      return {
        islands: x.islands.map((i) => ({
          ...i,
          availableModeIds: [...i.availableModeIds],
        })),
        links,
        componentCount: w.wComponents(ids, links),
      };
    },
  );
export const fictionalIslandArchipelagoNetworkExample = {
  input: {
    islands: [
      {
        id: "a",
        availableModeIds: ["boat"],
      },
      {
        id: "b",
        availableModeIds: ["boat", "air"],
      },
      {
        id: "c",
        availableModeIds: ["air"],
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
      {
        from: "a",
        to: "c",
      },
    ],
    edgeCount: 2,
    connected: true,
    seed: 42,
  },
  output: {
    islands: [
      {
        id: "a",
        availableModeIds: ["boat"],
      },
      {
        id: "b",
        availableModeIds: ["boat", "air"],
      },
      {
        id: "c",
        availableModeIds: ["air"],
      },
    ],
    links: [
      {
        from: "a",
        to: "b",
        modeId: "boat",
      },
      {
        from: "b",
        to: "c",
        modeId: "air",
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
  FictionalIslandArchipelagoNetworkInput,
  FictionalIslandArchipelagoNetworkOutput
>;
export const fictionalIslandArchipelagoNetworkTool = createModelDefinition<
  FictionalIslandArchipelagoNetworkInput,
  FictionalIslandArchipelagoNetworkOutput
>({
  id: "random/fictional-island-archipelago-network",
  title: "Random Fictional Island Archipelago Network Generator",
  description:
    "Link supplied imaginary islands only through shared caller transport modes with exact edge count and optional connectivity; nonuniform construction, no geographic or transport claims.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalIslandArchipelagoNetwork,
});
export const runFictionalIslandArchipelagoNetwork =
  fictionalIslandArchipelagoNetworkTool.execute;
export default fictionalIslandArchipelagoNetworkTool;
