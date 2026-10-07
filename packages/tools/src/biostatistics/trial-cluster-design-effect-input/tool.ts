import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meanClusterSize: number;
  readonly intraclusterCorrelation: number;
};
export type Output = { readonly designEffect: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanClusterSize: { type: "number", minimum: 1 },
    intraclusterCorrelation: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["meanClusterSize", "intraclusterCorrelation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { designEffect: { type: "number" } },
  required: ["designEffect"],
} as const;
/** Evaluate the equal-size-cluster design effect 1+(m−1)rho from explicit inputs without accounting for unequal cluster sizes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meanClusterSize, intraclusterCorrelation } = request;
  const compute = (): Output => {
    H.domain(
      meanClusterSize >= 1 &&
        intraclusterCorrelation >= 0 &&
        intraclusterCorrelation <= 1,
      "meanClusterSize",
    );
    return {
      designEffect: 1 + (meanClusterSize - 1) * intraclusterCorrelation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meanClusterSize: 20, intraclusterCorrelation: 0.05 },
  output: { designEffect: 1.9500000000000002 },
} satisfies ToolExample<Input, Output>;
export const trialClusterDesignEffectInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/trial-cluster-design-effect-input",
    title: "Trial Cluster Design Effect Input",
    description:
      "Evaluate the equal-size-cluster design effect 1+(m−1)rho from explicit inputs without accounting for unequal cluster sizes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanClusterSize: { type: "number", minimum: 1 },
        intraclusterCorrelation: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["meanClusterSize", "intraclusterCorrelation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { designEffect: { type: "number" } },
      required: ["designEffect"],
    },
    ports: {
      inputs: [
        {
          id: "meanClusterSize",
          label: "Mean Cluster Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intraclusterCorrelation",
          label: "Intracluster Correlation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "designEffect",
          label: "Design Effect",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialClusterDesignEffectInputTool.execute;
export default trialClusterDesignEffectInputTool;
