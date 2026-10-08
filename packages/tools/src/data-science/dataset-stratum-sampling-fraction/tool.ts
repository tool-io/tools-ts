import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampledStratumCount: number;
  readonly populationStratumCount: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampledStratumCount: { type: "number", minimum: 0 },
    populationStratumCount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampledStratumCount", "populationStratumCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate a supplied dataset-stratum sampling fraction and unsampled count on a positive population-count basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampledStratumCount, populationStratumCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(populationStratumCount) && populationStratumCount > 0,
      "populationStratumCount",
    ),
      populationStratumCount);
    H.domain(
      sampledStratumCount >= 0 && sampledStratumCount <= populationStratumCount,
      "sampledStratumCount",
    );
    return {
      fraction: sampledStratumCount / populationStratumCount,
      remainder: populationStratumCount - sampledStratumCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampledStratumCount: 30, populationStratumCount: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const datasetStratumSamplingFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/dataset-stratum-sampling-fraction",
    title: "Dataset Stratum Sampling Fraction Tool",
    description:
      "Calculate a supplied dataset-stratum sampling fraction and unsampled count on a positive population-count basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampledStratumCount: { type: "number", minimum: 0 },
        populationStratumCount: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampledStratumCount", "populationStratumCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "sampledStratumCount",
          label: "Sampled Stratum Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "populationStratumCount",
          label: "Population Stratum Count",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = datasetStratumSamplingFractionTool.execute;
export default datasetStratumSamplingFractionTool;
