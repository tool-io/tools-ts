import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly targetAmount: number; readonly purity: number };
export type Output = {
  readonly grossAmount: number;
  readonly impurityAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetAmount: { type: "number", minimum: 0 },
    purity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["targetAmount", "purity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossAmount: { type: "number" },
    impurityAmount: { type: "number" },
  },
  required: ["grossAmount", "impurityAmount"],
} as const;
/** Calculate biomolecule stock purity mass factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetAmount, purity } = request;
  const compute = (): Output => {
    H.domain(targetAmount >= 0 && purity > 0 && purity <= 1);
    return {
      grossAmount: targetAmount / purity,
      impurityAmount: targetAmount / purity - targetAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetAmount: 80, purity: 0.8 },
  output: { grossAmount: 100, impurityAmount: 20 },
} satisfies ToolExample<Input, Output>;
export const biomoleculeStockPurityMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/biomolecule-stock-purity-mass-factor",
    title: "Biomolecule Stock Purity Mass Factor Tool",
    description:
      "Calculate biomolecule stock purity mass factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetAmount: { type: "number", minimum: 0 },
        purity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["targetAmount", "purity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossAmount: { type: "number" },
        impurityAmount: { type: "number" },
      },
      required: ["grossAmount", "impurityAmount"],
    },
    ports: {
      inputs: [
        {
          id: "targetAmount",
          label: "Target Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purity",
          label: "Purity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossAmount",
          label: "Gross Amount",
          valueType: { type: "number" },
        },
        {
          id: "impurityAmount",
          label: "Impurity Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomoleculeStockPurityMassFactorTool.execute;
export default biomoleculeStockPurityMassFactorTool;
