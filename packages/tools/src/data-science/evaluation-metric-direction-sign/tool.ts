import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedMetricChange: number;
  readonly higherIsBetter: boolean;
};
export type Output = { readonly improvementSignedChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedMetricChange: { type: "number" },
    higherIsBetter: { type: "boolean" },
  },
  required: ["signedMetricChange", "higherIsBetter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { improvementSignedChange: { type: "number" } },
  required: ["improvementSignedChange"],
} as const;
/** Orient a supplied metric change so positive means improvement under an explicit higher-is-better flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedMetricChange, higherIsBetter } = request;
  const compute = (): Output => {
    return {
      improvementSignedChange: higherIsBetter
        ? signedMetricChange
        : -signedMetricChange,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedMetricChange: 0.2, higherIsBetter: true },
  output: { improvementSignedChange: 0.2 },
} satisfies ToolExample<Input, Output>;
export const evaluationMetricDirectionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/evaluation-metric-direction-sign",
    title: "Evaluation Metric Direction Sign Tool",
    description:
      "Orient a supplied metric change so positive means improvement under an explicit higher-is-better flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedMetricChange: { type: "number" },
        higherIsBetter: { type: "boolean" },
      },
      required: ["signedMetricChange", "higherIsBetter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { improvementSignedChange: { type: "number" } },
      required: ["improvementSignedChange"],
    },
    ports: {
      inputs: [
        {
          id: "signedMetricChange",
          label: "Signed Metric Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherIsBetter",
          label: "Higher Is Better",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "improvementSignedChange",
          label: "Improvement Signed Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = evaluationMetricDirectionSignTool.execute;
export default evaluationMetricDirectionSignTool;
