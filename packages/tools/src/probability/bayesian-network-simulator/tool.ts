import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type BayesianNode = {
  readonly name: string;
  readonly parents: readonly string[];
  readonly pTrue: number | Readonly<Record<string, number>>;
};
export type BayesianNetworkResult = {
  readonly marginals: Readonly<Record<string, number>>;
  readonly preview: readonly Readonly<Record<string, boolean>>[];
  readonly sampleCount: number;
};
const validProbability = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= 1;
export const simulateBayesianNetwork = (
  nodes: readonly BayesianNode[],
  sampleCount: number,
  seed: string,
): BayesianNetworkResult | null => {
  const known = new Set<string>();
  for (const node of nodes) {
    if (
      !node.name.trim() ||
      known.has(node.name) ||
      node.parents.some((parent) => !known.has(parent))
    )
      return null;
    if (
      node.parents.length
        ? typeof node.pTrue !== "object" ||
          node.pTrue === null ||
          Array.from({ length: 2 ** node.parents.length }, (_, state) =>
            state.toString(2).padStart(node.parents.length, "0"),
          ).some(
            (state) =>
              !validProbability((node.pTrue as Record<string, number>)[state]),
          )
        : !validProbability(node.pTrue)
    )
      return null;
    known.add(node.name);
  }
  if (!nodes.length || !seed.trim()) return null;
  const random = createSeededRandom(seed),
    counts = Object.fromEntries(nodes.map(({ name }) => [name, 0])) as Record<
      string,
      number
    >,
    preview: Record<string, boolean>[] = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const sample: Record<string, boolean> = {};
    for (const node of nodes) {
      const state = node.parents
        .map((parent) => (sample[parent] ? "1" : "0"))
        .join("");
      const probability =
        typeof node.pTrue === "number" ? node.pTrue : node.pTrue[state]!;
      sample[node.name] = random() < probability;
      if (sample[node.name]) counts[node.name]! += 1;
    }
    if (preview.length < 10) preview.push(sample);
  }
  return {
    marginals: Object.fromEntries(
      nodes.map(({ name }) => [
        name,
        Number((counts[name]! / sampleCount).toPrecision(12)),
      ]),
    ),
    preview,
    sampleCount,
  };
};
export const bayesianNetworkSimulatorExample = {
  input: {
    network: {
      nodes: [
        { name: "Rain", parents: [], pTrue: 0.2 },
        { name: "Wet", parents: ["Rain"], pTrue: { "0": 0.1, "1": 0.9 } },
      ],
    },
    sampleCount: 5,
    seed: "tool.io",
  },
  output: {
    simulation: {
      marginals: { Rain: 0.2, Wet: 0.2 },
      preview: [
        { Rain: true, Wet: true },
        { Rain: false, Wet: false },
        { Rain: false, Wet: false },
        { Rain: false, Wet: false },
        { Rain: false, Wet: false },
      ],
      sampleCount: 5,
    },
  },
} satisfies ToolExample<
  {
    readonly network: { readonly nodes: readonly BayesianNode[] };
    readonly sampleCount: number;
    readonly seed: string;
  },
  { readonly simulation: BayesianNetworkResult }
>;
export const bayesianNetworkSimulatorTool = createSimpleTool({
  id: "probability/bayesian-network-simulator",
  title: "Bayesian Network Simulator",
  description:
    "Draw reproducible ancestral samples from a Boolean Bayesian network.",
  inputs: [
    {
      format: "model/bayesian-network",
      id: "network",
      kind: "object",
      label: "Network",
    },
    {
      id: "sampleCount",
      kind: "integer",
      label: "Samples",
      maximum: 10_000,
      minimum: 1,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "simulation/bayesian-network",
      id: "simulation",
      kind: "object",
      label: "Simulation",
    },
  ],
  calculate: (input) => {
    const nodes = (input.network as { nodes?: unknown }).nodes;
    if (!Array.isArray(nodes))
      return simpleError("network", "Enter nodes in topological order.");
    const simulation = simulateBayesianNetwork(
      nodes as BayesianNode[],
      input.sampleCount as number,
      input.seed as string,
    );
    if (!simulation)
      return simpleError(
        "network",
        "Enter a valid Boolean Bayesian network in topological order.",
      );
    return { simulation };
  },
});
export const runBayesianNetworkSimulator = bayesianNetworkSimulatorTool.execute;
export default bayesianNetworkSimulatorTool;
