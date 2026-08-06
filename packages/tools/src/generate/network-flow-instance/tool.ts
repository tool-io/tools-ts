import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type NetworkFlowEdge = {
  readonly capacity: number;
  readonly from: number;
  readonly to: number;
};
export type NetworkFlowInstance = {
  readonly edges: readonly NetworkFlowEdge[];
  readonly nodeCount: number;
  readonly sink: number;
  readonly source: number;
};
export const generateNetworkFlowInstance = (
  nodeCount: number,
  probability: number,
  minimumCapacity: number,
  maximumCapacity: number,
  seed: string,
): NetworkFlowInstance | null => {
  if (!seed.trim() || maximumCapacity < minimumCapacity) return null;
  const random = createSeededRandom(seed);
  const edges: NetworkFlowEdge[] = [];
  for (let from = 0; from < nodeCount; from += 1)
    for (let to = 0; to < nodeCount; to += 1)
      if (from !== to && random() < probability)
        edges.push({
          capacity:
            minimumCapacity +
            Math.floor(random() * (maximumCapacity - minimumCapacity + 1)),
          from,
          to,
        });
  return { edges, nodeCount, sink: nodeCount - 1, source: 0 };
};

export const networkFlowInstanceExample = {
  input: {
    maximumCapacity: 5,
    minimumCapacity: 1,
    nodeCount: 3,
    probability: 0.4,
    seed: "tool.io",
  },
  output: {
    instance: {
      edges: [
        { capacity: 4, from: 0, to: 1 },
        { capacity: 1, from: 0, to: 2 },
      ],
      nodeCount: 3,
      sink: 2,
      source: 0,
    },
  },
} satisfies ToolExample<
  {
    readonly maximumCapacity: number;
    readonly minimumCapacity: number;
    readonly nodeCount: number;
    readonly probability: number;
    readonly seed: string;
  },
  { readonly instance: NetworkFlowInstance }
>;

export const networkFlowInstanceTool = createSimpleTool({
  id: "generate/network-flow-instance",
  title: "Network Flow Instance Generator",
  description:
    "Generate a reproducible directed capacitated graph for network-flow experiments.",
  inputs: [
    {
      id: "nodeCount",
      kind: "integer",
      label: "Node count",
      maximum: 1_000,
      minimum: 2,
    },
    {
      format: "probability",
      id: "probability",
      kind: "number",
      label: "Edge probability",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "minimumCapacity",
      kind: "integer",
      label: "Minimum capacity",
      minimum: 1,
    },
    {
      id: "maximumCapacity",
      kind: "integer",
      label: "Maximum capacity",
      minimum: 1,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "instance/network-flow",
      id: "instance",
      kind: "object",
      label: "Flow instance",
    },
  ],
  calculate: (input) => {
    const instance = generateNetworkFlowInstance(
      input.nodeCount as number,
      input.probability as number,
      input.minimumCapacity as number,
      input.maximumCapacity as number,
      input.seed as string,
    );
    if (!instance)
      return simpleError(
        "maximumCapacity",
        "Maximum capacity must be at least the minimum and seed must not be blank.",
      );
    return { instance };
  },
});
export const runNetworkFlowInstance = networkFlowInstanceTool.execute;
export default networkFlowInstanceTool;
