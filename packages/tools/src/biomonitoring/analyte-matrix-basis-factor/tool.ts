import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly matrixAmount: number;
  readonly reportingBasis: number;
};
export type Output = { readonly normalizedAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number" },
    matrixAmount: { type: "number", exclusiveMinimum: 0 },
    reportingBasis: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["amount", "matrixAmount", "reportingBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedAmount: { type: "number" } },
  required: ["normalizedAmount"],
} as const;
/** Normalize a supplied bench analyte quantity to an explicit matrix reporting basis without exposure interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, matrixAmount, reportingBasis } = request;
  const compute = (): Output => {
    H.positive(matrixAmount);
    H.positive(reportingBasis);
    return { normalizedAmount: (amount / matrixAmount) * reportingBasis };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 12, matrixAmount: 3, reportingBasis: 10 },
  output: { normalizedAmount: 40 },
} satisfies ToolExample<Input, Output>;
export const analyteMatrixBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/analyte-matrix-basis-factor",
    title: "Analyte Matrix Basis Factor Tool",
    description:
      "Normalize a supplied bench analyte quantity to an explicit matrix reporting basis without exposure interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number" },
        matrixAmount: { type: "number", exclusiveMinimum: 0 },
        reportingBasis: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["amount", "matrixAmount", "reportingBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalizedAmount: { type: "number" } },
      required: ["normalizedAmount"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "matrixAmount",
          label: "Matrix Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportingBasis",
          label: "Reporting Basis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedAmount",
          label: "Normalized Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = analyteMatrixBasisFactorTool.execute;
export default analyteMatrixBasisFactorTool;
