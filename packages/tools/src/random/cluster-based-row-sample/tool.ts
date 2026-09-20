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
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  snArray,
  snBoundOutput,
  snCopyRecord,
  snDistinct,
  snExpansionBudget,
  snFrequencies,
  snId,
  snInteger,
  snObject,
  snPick,
  snProbability,
  snText,
  snWeightedIndex,
  type SamplingRecord,
} from "../m250-sampling-narrative-support.js";

export type ClusterSampleRow = SamplingRecord & { readonly cluster: string };
export type ClusterBasedRowSampleInput = {
  readonly rows: readonly ClusterSampleRow[];
  readonly count: number;
  readonly replacement: boolean;
  readonly weighting: "uniform-cluster" | "proportional-size";
  readonly seed?: number;
};
export type ClusterBasedRowSampleOutput = {
  readonly clusters: readonly {
    readonly cluster: string;
    readonly populationRows: number;
    readonly weight: number;
  }[];
  readonly draws: readonly {
    readonly draw: number;
    readonly cluster: string;
    readonly conditionalProbability: number;
    readonly rows: readonly ClusterSampleRow[];
  }[];
  readonly returnedRowCount: number;
  readonly randomness: GeneratorReplay;
};
const rowSchema = snObject({
  id: snId,
  values: snArray(snText, 32),
  cluster: snId,
});
export const inputSchema = snObject(
  {
    rows: snArray(rowSchema, 512),
    count: { type: "integer", minimum: 0, maximum: 128 },
    replacement: { type: "boolean" },
    weighting: {
      type: "string",
      enum: ["uniform-cluster", "proportional-size"],
      description:
        "Draw cluster IDs uniformly or proportional to their supplied row counts; include every row per cluster occurrence.",
    },
    seed: generatorSeedSchema,
  },
  ["rows", "count", "replacement", "weighting"],
);
export const outputSchema = snObject({
  clusters: snArray(
    snObject({ cluster: snId, populationRows: snInteger, weight: snInteger }),
    512,
  ),
  draws: snArray(
    snObject({
      draw: snInteger,
      cluster: snId,
      conditionalProbability: snProbability,
      rows: snArray(rowSchema, 512),
    }),
    128,
  ),
  returnedRowCount: { type: "integer", minimum: 0, maximum: 8192 },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is ClusterBasedRowSampleInput =>
  matchesModelInput(input, inputSchema);
export const calculateClusterBasedRowSample = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ClusterBasedRowSampleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(
      input.rows.map((row) => row.id),
      "rows",
    );
    const sizes = snFrequencies(input.rows.map((row) => row.cluster));
    const clusters = [...new Set(input.rows.map((row) => row.cluster))].map(
      (cluster) => ({
        cluster,
        populationRows: sizes.get(cluster) ?? 0,
        weight:
          input.weighting === "uniform-cluster" ? 1 : (sizes.get(cluster) ?? 0),
      }),
    );
    if (
      input.count > 0 &&
      (!clusters.length ||
        (!input.replacement && input.count > clusters.length))
    )
      simpleError(
        "count",
        "Not enough supplied clusters for this draw.",
        "infeasible_cluster_count",
      );
    const worstRows = input.replacement
      ? input.count *
        Math.max(0, ...clusters.map((cluster) => cluster.populationRows))
      : input.rows.length;
    if (worstRows > 8192)
      simpleError(
        "count",
        "Worst-case returned row occurrences exceed 8192.",
        "resource_limit_exceeded",
      );
    snExpansionBudget(input.rows, worstRows, "count");
    const pool = [...clusters],
      random = createGeneratorRandom(input.seed, context),
      draws: ClusterBasedRowSampleOutput["draws"][number][] = [];
    let returnedRowCount = 0;
    for (let i = 0; i < input.count; i += 1) {
      const index =
        input.weighting === "uniform-cluster"
          ? snPick(
              pool.map((_, j) => j),
              random,
            )
          : snWeightedIndex(
              pool.map((cluster) => cluster.weight),
              random,
            );
      const chosen = pool[index],
        total = pool.reduce((sum, cluster) => sum + cluster.weight, 0);
      const rows = input.rows
        .filter((row) => row.cluster === chosen.cluster)
        .map((row) => ({ ...snCopyRecord(row), cluster: row.cluster }));
      draws.push({
        draw: i,
        cluster: chosen.cluster,
        conditionalProbability: chosen.weight / total,
        rows,
      });
      returnedRowCount += rows.length;
      if (!input.replacement) pool.splice(index, 1);
    }
    return toolSuccess(
      snBoundOutput({
        clusters,
        draws,
        returnedRowCount,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const clusterBasedRowSampleExample = {
  input: {
    rows: [
      { id: "a", cluster: "west", values: ["12"] },
      { id: "b", cluster: "west", values: ["19"] },
      { id: "c", cluster: "east", values: ["7"] },
    ],
    count: 2,
    replacement: false,
    weighting: "uniform-cluster",
    seed: 42,
  },
  output: {
    clusters: [
      { cluster: "west", populationRows: 2, weight: 1 },
      { cluster: "east", populationRows: 1, weight: 1 },
    ],
    draws: [
      {
        draw: 0,
        cluster: "east",
        conditionalProbability: 0.5,
        rows: [{ id: "c", cluster: "east", values: ["7"] }],
      },
      {
        draw: 1,
        cluster: "west",
        conditionalProbability: 1,
        rows: [
          { id: "a", cluster: "west", values: ["12"] },
          { id: "b", cluster: "west", values: ["19"] },
        ],
      },
    ],
    returnedRowCount: 3,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  ClusterBasedRowSampleInput,
  ClusterBasedRowSampleOutput
>;
export const clusterBasedRowSampleTool = createModelDefinition<
  ClusterBasedRowSampleInput,
  ClusterBasedRowSampleOutput
>({
  id: "random/cluster-based-row-sample",
  title: "Random Cluster-Based Row Sample Generator",
  description:
    "Draw supplied cluster IDs under explicit cluster weights and return every original row per selected cluster occurrence with conditional draw probabilities.",
  inputSchema,
  outputSchema,
  execute: calculateClusterBasedRowSample,
});
export const runClusterBasedRowSample = clusterBasedRowSampleTool.execute;
export default clusterBasedRowSampleTool;
