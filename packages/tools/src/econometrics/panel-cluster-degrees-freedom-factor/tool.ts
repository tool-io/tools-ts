import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observations: number;
  readonly parameters: number;
  readonly clusters: number;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observations: { type: "integer", minimum: 2 },
    parameters: { type: "integer", minimum: 0 },
    clusters: { type: "integer", minimum: 2 },
  },
  required: ["observations", "parameters", "clusters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Conventional CR1 factor G/(G-1)*(N-1)/(N-K); caller must establish the estimator convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observations, parameters, clusters } = request;
  const compute = (): Output => {
    H.integer(observations, 2);
    H.integer(parameters, 0, observations - 1);
    H.integer(clusters, 2, observations);
    return {
      factor:
        ((clusters / (clusters - 1)) * (observations - 1)) /
        (observations - parameters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observations: 10, parameters: 2, clusters: 5 },
  output: { factor: 1.40625 },
} satisfies ToolExample<Input, Output>;
export const panelClusterDegreesFreedomFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/panel-cluster-degrees-freedom-factor",
    title: "Panel Cluster Degrees Freedom Factor Tool",
    description:
      "Conventional CR1 factor G/(G-1)*(N-1)/(N-K); caller must establish the estimator convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observations: { type: "integer", minimum: 2 },
        parameters: { type: "integer", minimum: 0 },
        clusters: { type: "integer", minimum: 2 },
      },
      required: ["observations", "parameters", "clusters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { factor: { type: "number" } },
      required: ["factor"],
    },
    ports: {
      inputs: [
        {
          id: "observations",
          label: "Observations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parameters",
          label: "Parameters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "clusters",
          label: "Clusters",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = panelClusterDegreesFreedomFactorTool.execute;
export default panelClusterDegreesFreedomFactorTool;
