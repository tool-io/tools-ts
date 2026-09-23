import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clusterIds: readonly string[];
  readonly observed: readonly boolean[];
  readonly clusterWeights: readonly number[];
};
export type Output = {
  readonly clusters: number;
  readonly supportedClusters: number;
  readonly totalWeight: number;
  readonly supportedWeightShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusterIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    clusterWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["clusterIds", "observed", "clusterWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusters: { type: "integer" },
    supportedClusters: { type: "integer" },
    totalWeight: { type: "number" },
    supportedWeightShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "clusters",
    "supportedClusters",
    "totalWeight",
    "supportedWeightShare",
    "defined",
  ],
} as const;
/** Deduplicate cluster-level weights before measuring any-observation support; repeated cluster weights must agree. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clusterIds, observed, clusterWeights } = request;
  const compute = (): Output => {
    H.sameLength(clusterIds, observed);
    H.sameLength(clusterIds, clusterWeights);
    H.domain(clusterWeights.every((x) => x >= 0));
    return (() => {
      const weights = new Map<string, number>(),
        support = new Set<string>();
      clusterIds.forEach((id, i) => {
        if (weights.has(id)) H.domain(weights.get(id) === clusterWeights[i]);
        else weights.set(id, clusterWeights[i]);
        if (observed[i]) support.add(id);
      });
      const totalWeight = [...weights.values()].reduce((a, b) => a + b, 0),
        supportedWeight = [...weights].reduce(
          (s, [id, w]) => s + (support.has(id) ? w : 0),
          0,
        );
      return {
        clusters: weights.size,
        supportedClusters: support.size,
        totalWeight,
        supportedWeightShare:
          totalWeight > 0 ? supportedWeight / totalWeight : 0,
        defined: totalWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    clusterIds: ["A", "A", "B"],
    observed: [true, false, false],
    clusterWeights: [2, 2, 3],
  },
  output: {
    clusters: 2,
    supportedClusters: 1,
    totalWeight: 5,
    supportedWeightShare: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const clusterObservationSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/cluster-observation-support-share",
    title: "Cluster Observation Support Share Tool",
    description:
      "Deduplicate cluster-level weights before measuring any-observation support; repeated cluster weights must agree.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clusterIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        clusterWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["clusterIds", "observed", "clusterWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clusters: { type: "integer" },
        supportedClusters: { type: "integer" },
        totalWeight: { type: "number" },
        supportedWeightShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "clusters",
        "supportedClusters",
        "totalWeight",
        "supportedWeightShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "clusterIds",
          label: "Cluster Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "clusterWeights",
          label: "Cluster Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "clusters", label: "Clusters", valueType: { type: "integer" } },
        {
          id: "supportedClusters",
          label: "Supported Clusters",
          valueType: { type: "integer" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        {
          id: "supportedWeightShare",
          label: "Supported Weight Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = clusterObservationSupportShareTool.execute;
export default clusterObservationSupportShareTool;
