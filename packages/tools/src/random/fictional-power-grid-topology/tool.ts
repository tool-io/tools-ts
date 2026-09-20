import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FictionalPowerGridTopologyInput = w.WSeed & {
  readonly nodes: readonly {
    readonly id: string;
    readonly role: "generator" | "junction" | "consumer";
  }[];
  readonly candidates: readonly w.WLink[];
  readonly extraBackboneLinks: number;
};
export type FictionalPowerGridTopologyOutput = w.WMeta & {
  readonly nodes: readonly {
    readonly id: string;
    readonly role: "generator" | "junction" | "consumer";
  }[];
  readonly edges: readonly w.WLink[];
  readonly consumerAttachments: readonly {
    readonly consumerId: string;
    readonly parentId: string;
  }[];
  readonly componentCount: number;
  readonly electricalFeasibilityAssessed: false;
};
export const inputSchema = w.wInput({
  nodes: w.wArray(
    w.wObject({
      id: w.wId,
      role: { type: "string", enum: ["generator", "junction", "consumer"] },
    }),
    16,
    1,
  ),
  candidates: w.wArray(w.wLinkSchema, 64),
  extraBackboneLinks: w.wInt(0, 64),
});
export const outputSchema = w.wOutput({
  nodes: w.wArray(
    w.wObject({
      id: w.wId,
      role: { type: "string", enum: ["generator", "junction", "consumer"] },
    }),
    16,
    1,
  ),
  edges: w.wArray(w.wLinkSchema, 64),
  consumerAttachments: w.wArray(
    w.wObject({ consumerId: w.wId, parentId: w.wId }),
    15,
  ),
  componentCount: w.wInt(1, 1),
  electricalFeasibilityAssessed: { type: "boolean", const: false },
});
const isInput = (v: unknown): v is FictionalPowerGridTopologyInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalPowerGridTopology = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalPowerGridTopologyOutput, keyof w.WMeta> => {
      const ids = x.nodes.map((n) => n.id);
      w.wUnique(ids, "nodes");
      w.wLinks(ids, x.candidates, "candidates");
      if (!x.nodes.some((n) => n.role === "generator"))
        return w.wInfeasible("nodes");
      const backbone = x.nodes
          .filter((n) => n.role !== "consumer")
          .map((n) => n.id),
        consumers = x.nodes.filter((n) => n.role === "consumer");
      const edges = w.wConnected(
        backbone,
        x.candidates.filter(
          (e) => backbone.includes(e.from) && backbone.includes(e.to),
        ),
        backbone.length - 1 + x.extraBackboneLinks,
        random,
      );
      const consumerAttachments = consumers.map((n) => {
        const eligible = x.candidates.flatMap((e) =>
          e.from === n.id && backbone.includes(e.to)
            ? [e.to]
            : e.to === n.id && backbone.includes(e.from)
              ? [e.from]
              : [],
        );
        if (!eligible.length) return w.wInfeasible("candidates");
        const parentId = random.pick(eligible);
        edges.push({ from: n.id, to: parentId });
        return { consumerId: n.id, parentId };
      });
      return {
        nodes: x.nodes.map((n) => ({ ...n })),
        edges,
        consumerAttachments,
        componentCount: w.wComponents(ids, edges),
        electricalFeasibilityAssessed: false,
      };
    },
  );
export const fictionalPowerGridTopologyExample = {
  input: {
    nodes: [
      {
        id: "g",
        role: "generator",
      },
      {
        id: "j",
        role: "junction",
      },
      {
        id: "c",
        role: "consumer",
      },
      {
        id: "d",
        role: "consumer",
      },
    ],
    candidates: [
      {
        from: "g",
        to: "j",
      },
      {
        from: "j",
        to: "c",
      },
      {
        from: "g",
        to: "d",
      },
      {
        from: "j",
        to: "d",
      },
    ],
    extraBackboneLinks: 0,
    seed: 42,
  },
  output: {
    nodes: [
      {
        id: "g",
        role: "generator",
      },
      {
        id: "j",
        role: "junction",
      },
      {
        id: "c",
        role: "consumer",
      },
      {
        id: "d",
        role: "consumer",
      },
    ],
    edges: [
      {
        from: "g",
        to: "j",
      },
      {
        from: "c",
        to: "j",
      },
      {
        from: "d",
        to: "g",
      },
    ],
    consumerAttachments: [
      {
        consumerId: "c",
        parentId: "j",
      },
      {
        consumerId: "d",
        parentId: "g",
      },
    ],
    componentCount: 1,
    electricalFeasibilityAssessed: false,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FictionalPowerGridTopologyInput,
  FictionalPowerGridTopologyOutput
>;
export const fictionalPowerGridTopologyTool = createModelDefinition<
  FictionalPowerGridTopologyInput,
  FictionalPowerGridTopologyOutput
>({
  id: "random/fictional-power-grid-topology",
  title: "Random Fictional Power Grid Topology Generator",
  description:
    "Construct a connected imaginary generator/junction backbone and leaf consumer attachments; topology only, explicitly not electrical feasibility, load flow, or installation guidance.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalPowerGridTopology,
});
export const runFictionalPowerGridTopology =
  fictionalPowerGridTopologyTool.execute;
export default fictionalPowerGridTopologyTool;
