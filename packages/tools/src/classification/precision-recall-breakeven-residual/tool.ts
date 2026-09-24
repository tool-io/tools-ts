import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly precision: number;
  readonly recall: number;
  readonly tolerance: number;
};
export type Output = {
  readonly residual: number;
  readonly equalWithinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    precision: { type: "number", minimum: 0, maximum: 1 },
    recall: { type: "number", minimum: 0, maximum: 1 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["precision", "recall", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    equalWithinTolerance: { type: "boolean" },
  },
  required: ["residual", "equalWithinTolerance"],
} as const;
/** Calculate precision recall breakeven residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { precision, recall, tolerance } = request;
  const compute = (): Output => {
    H.probability(precision);
    H.probability(recall);
    H.domain(tolerance >= 0);
    const residual = precision - recall;
    return { residual, equalWithinTolerance: Math.abs(residual) <= tolerance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { precision: 0.75, recall: 0.5, tolerance: 0.1 },
  output: { residual: 0.25, equalWithinTolerance: false },
} satisfies ToolExample<Input, Output>;
export const precisionRecallBreakevenResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/precision-recall-breakeven-residual",
    title: "Precision Recall Breakeven Residual Tool",
    description:
      "Calculate precision recall breakeven residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        precision: { type: "number", minimum: 0, maximum: 1 },
        recall: { type: "number", minimum: 0, maximum: 1 },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["precision", "recall", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "number" },
        equalWithinTolerance: { type: "boolean" },
      },
      required: ["residual", "equalWithinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "precision",
          label: "Precision",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recall",
          label: "Recall",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "equalWithinTolerance",
          label: "Equal Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = precisionRecallBreakevenResidualTool.execute;
export default precisionRecallBreakevenResidualTool;
