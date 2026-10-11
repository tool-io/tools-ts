import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predictedTerm: number;
  readonly observedTerm: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedTerm: { type: "number" },
    observedTerm: { type: "number" },
  },
  required: ["predictedTerm", "observedTerm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit predicted sequence term from an observed term on the same quantity basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predictedTerm, observedTerm } = request;
  const compute = (): Output => {
    return { signedGap: observedTerm - predictedTerm };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { predictedTerm: 12, observedTerm: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const sequenceTermPredictionResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["sequence", "mathematics"],
      keywords: ["sequence", "mathematics"],
    },
    id: "sequence/sequence-term-prediction-residual",
    title: "Sequence Term Prediction Residual",
    description:
      "Subtract an explicit predicted sequence term from an observed term on the same quantity basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedTerm: { type: "number" },
        observedTerm: { type: "number" },
      },
      required: ["predictedTerm", "observedTerm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "predictedTerm",
          label: "Predicted Term",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedTerm",
          label: "Observed Term",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sequenceTermPredictionResidualTool.execute;
export default sequenceTermPredictionResidualTool;
