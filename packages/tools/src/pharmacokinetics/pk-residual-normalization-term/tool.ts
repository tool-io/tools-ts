import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly predicted: number;
  readonly suppliedScale: number;
};
export type Output = {
  readonly residual: number;
  readonly normalizedResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    predicted: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "predicted", "suppliedScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    normalizedResidual: { type: "number" },
  },
  required: ["residual", "normalizedResidual"],
} as const;
/** Normalize one supplied nonclinical model residual without selecting an error model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, predicted, suppliedScale } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      residual: observed - predicted,
      normalizedResidual: (observed - predicted) / suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 12, predicted: 10, suppliedScale: 2 },
  output: { residual: 2, normalizedResidual: 1 },
} satisfies ToolExample<Input, Output>;
export const pkResidualNormalizationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-residual-normalization-term",
    title: "PK Residual Normalization Term Tool",
    description:
      "Normalize one supplied nonclinical model residual without selecting an error model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        predicted: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observed", "predicted", "suppliedScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "number" },
        normalizedResidual: { type: "number" },
      },
      required: ["residual", "normalizedResidual"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predicted",
          label: "Predicted",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "normalizedResidual",
          label: "Normalized Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkResidualNormalizationTermTool.execute;
export default pkResidualNormalizationTermTool;
