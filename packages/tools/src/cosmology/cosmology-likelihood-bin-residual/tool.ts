import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedBin: number;
  readonly predictedBin: number;
  readonly suppliedStandardDeviation: number;
};
export type Output = { readonly standardizedResidual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedBin: { type: "number" },
    predictedBin: { type: "number" },
    suppliedStandardDeviation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedBin", "predictedBin", "suppliedStandardDeviation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardizedResidual: { type: "number" } },
  required: ["standardizedResidual"],
} as const;
/** Standardize one supplied cosmology bin residual by an explicit positive uncertainty without assuming independent bins or forming a likelihood. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedBin, predictedBin, suppliedStandardDeviation } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedStandardDeviation) &&
        suppliedStandardDeviation > 0,
      "suppliedStandardDeviation",
    ),
      suppliedStandardDeviation);
    return {
      standardizedResidual:
        (observedBin - predictedBin) / suppliedStandardDeviation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedBin: 12, predictedBin: 10, suppliedStandardDeviation: 2 },
  output: { standardizedResidual: 1 },
} satisfies ToolExample<Input, Output>;
export const cosmologyLikelihoodBinResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/cosmology-likelihood-bin-residual",
    title: "Cosmology Likelihood Bin Residual",
    description:
      "Standardize one supplied cosmology bin residual by an explicit positive uncertainty without assuming independent bins or forming a likelihood.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedBin: { type: "number" },
        predictedBin: { type: "number" },
        suppliedStandardDeviation: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedBin", "predictedBin", "suppliedStandardDeviation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { standardizedResidual: { type: "number" } },
      required: ["standardizedResidual"],
    },
    ports: {
      inputs: [
        {
          id: "observedBin",
          label: "Observed Bin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictedBin",
          label: "Predicted Bin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedStandardDeviation",
          label: "Supplied Standard Deviation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "standardizedResidual",
          label: "Standardized Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cosmologyLikelihoodBinResidualTool.execute;
export default cosmologyLikelihoodBinResidualTool;
