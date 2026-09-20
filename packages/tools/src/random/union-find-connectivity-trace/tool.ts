import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateConnectedComponents } from "../../graph/connected-components/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  enumSchema,
  booleanSchema,
  distinct,
} from "../m500b-csv-algorithms-schemas.js";

type ConnectivityOperation = "union" | "query";
export type UnionFindConnectivityTraceInput = {
  readonly nodeCount: number;
  readonly operations: readonly ConnectivityOperation[];
  readonly eventCount: number;
  readonly seed?: number;
};
type ConnectivityEvent = {
  readonly kind: ConnectivityOperation;
  readonly a: number;
  readonly b: number;
  readonly connected: boolean;
  readonly redundantUnion: boolean;
  readonly components: readonly number[];
};
export type UnionFindConnectivityTraceOutput = {
  readonly events: readonly ConnectivityEvent[];
  readonly finalComponents: readonly number[];
  readonly randomness: GeneratorReplay;
};
const operationSchema = enumSchema(["union", "query"]),
  labelsSchema = arraySchema(countSchema(15), 16);
export const inputSchema = objectSchema(
  {
    nodeCount: countSchema(16, 1),
    operations: arraySchema(operationSchema, 2, 1),
    eventCount: countSchema(64, 1),
    seed: generatorSeedSchema,
  },
  ["nodeCount", "operations", "eventCount"],
);
export const outputSchema = objectSchema({
  events: arraySchema(
    objectSchema({
      kind: operationSchema,
      a: countSchema(15),
      b: countSchema(15),
      connected: booleanSchema,
      redundantUnion: booleanSchema,
      components: labelsSchema,
    }),
    64,
  ),
  finalComponents: labelsSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is UnionFindConnectivityTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateUnionFindConnectivityTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UnionFindConnectivityTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.operations, "operations");
    const random = createGeneratorRandom(input.seed, context),
      parent = Array.from({ length: input.nodeCount }, (_, index) => index),
      neighbors = Array.from(
        { length: input.nodeCount },
        () => new Set<number>(),
      );
    const parentOf = (node: number): number => {
      const value = parent[node];
      if (value === undefined) throw new Error("Missing disjoint-set node.");
      return value;
    };
    const find = (node: number): number => {
      let root = node;
      while (parentOf(root) !== root) root = parentOf(root);
      while (parentOf(node) !== root) {
        const next = parentOf(node);
        parent[node] = root;
        node = next;
      }
      return root;
    };
    const labels = (): number[] => {
      const ids = new Map<number, number>();
      return parent.map((_, node) => {
        const root = find(node);
        if (!ids.has(root)) ids.set(root, ids.size);
        const id = ids.get(root);
        if (id === undefined) throw new Error("Missing component label.");
        return id;
      });
    };
    const name = (node: number): string => "n" + String(node).padStart(2, "0");
    const events = Array.from(
      { length: input.eventCount },
      (): ConnectivityEvent => {
        const kind = random.pick(input.operations),
          a = random.integer(0, input.nodeCount - 1),
          b = random.integer(0, input.nodeCount - 1),
          rootA = find(a),
          rootB = find(b),
          redundantUnion = kind === "union" && rootA === rootB;
        if (kind === "union") {
          parent[Math.max(rootA, rootB)] = Math.min(rootA, rootB);
          const list = neighbors[a];
          if (!list) throw new Error("Missing adjacency set.");
          list.add(b);
        }
        const components = labels(),
          graph = Object.fromEntries(
            neighbors.map((targets, node) => [
              name(node),
              [...targets].map(name),
            ]),
          );
        const core = calculateConnectedComponents({ graph }).table;
        if (JSON.stringify(core.components) !== JSON.stringify(components))
          throw new Error(
            "Disjoint-set state disagrees with connected-components core.",
          );
        return {
          kind,
          a,
          b,
          connected: find(a) === find(b),
          redundantUnion,
          components,
        };
      },
    );
    return toolSuccess({
      events,
      finalComponents: labels(),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const unionFindConnectivityTraceExample = {
  input: {
    nodeCount: 3,
    operations: ["union", "query"],
    eventCount: 3,
    seed: 42,
  },
  output: {
    events: [
      {
        kind: "query",
        a: 1,
        b: 2,
        connected: false,
        redundantUnion: false,
        components: [0, 1, 2],
      },
      {
        kind: "query",
        a: 0,
        b: 1,
        connected: false,
        redundantUnion: false,
        components: [0, 1, 2],
      },
      {
        kind: "union",
        a: 1,
        b: 2,
        connected: true,
        redundantUnion: false,
        components: [0, 1, 1],
      },
    ],
    finalComponents: [0, 1, 1],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  UnionFindConnectivityTraceInput,
  UnionFindConnectivityTraceOutput
>;
export const unionFindConnectivityTraceTool = createModelDefinition<
  UnionFindConnectivityTraceInput,
  UnionFindConnectivityTraceOutput
>({
  id: "random/union-find-connectivity-trace",
  title: "Random Union Find Connectivity Trace Generator",
  description:
    "Generate union and connectivity queries with path-compressed disjoint-set snapshots, explicit redundant unions and per-step connected-components cross-checks; endpoint sampling permits self operations.",
  inputSchema,
  outputSchema,
  execute: calculateUnionFindConnectivityTrace,
});
export const runUnionFindConnectivityTrace =
  unionFindConnectivityTraceTool.execute;
export default unionFindConnectivityTraceTool;
