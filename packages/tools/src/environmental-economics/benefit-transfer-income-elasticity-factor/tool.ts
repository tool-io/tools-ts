import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceIncome: number;
  readonly targetIncome: number;
  readonly suppliedElasticity: number;
};
export type Output = { readonly incomeAdjustmentFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceIncome: { type: "number", exclusiveMinimum: 0 },
    targetIncome: { type: "number", exclusiveMinimum: 0 },
    suppliedElasticity: { type: "number" },
  },
  required: ["sourceIncome", "targetIncome", "suppliedElasticity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { incomeAdjustmentFactor: { type: "number" } },
  required: ["incomeAdjustmentFactor"],
} as const;
/** Calculate an explicit target-to-source income ratio raised to a supplied benefit-transfer elasticity without validating benefit comparability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceIncome, targetIncome, suppliedElasticity } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(sourceIncome) && sourceIncome > 0,
      "sourceIncome",
    ),
      sourceIncome);
    (H.domain(
      Number.isFinite(targetIncome) && targetIncome > 0,
      "targetIncome",
    ),
      targetIncome);
    return {
      incomeAdjustmentFactor: Math.pow(
        targetIncome / sourceIncome,
        suppliedElasticity,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceIncome: 100, targetIncome: 200, suppliedElasticity: 0.5 },
  output: { incomeAdjustmentFactor: 1.4142135623730951 },
} satisfies ToolExample<Input, Output>;
export const benefitTransferIncomeElasticityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/benefit-transfer-income-elasticity-factor",
      title: "Benefit Transfer Income Elasticity Factor Tool",
      description:
        "Calculate an explicit target-to-source income ratio raised to a supplied benefit-transfer elasticity without validating benefit comparability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceIncome: { type: "number", exclusiveMinimum: 0 },
          targetIncome: { type: "number", exclusiveMinimum: 0 },
          suppliedElasticity: { type: "number" },
        },
        required: ["sourceIncome", "targetIncome", "suppliedElasticity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { incomeAdjustmentFactor: { type: "number" } },
        required: ["incomeAdjustmentFactor"],
      },
      ports: {
        inputs: [
          {
            id: "sourceIncome",
            label: "Source Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetIncome",
            label: "Target Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedElasticity",
            label: "Supplied Elasticity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "incomeAdjustmentFactor",
            label: "Income Adjustment Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = benefitTransferIncomeElasticityFactorTool.execute;
export default benefitTransferIncomeElasticityFactorTool;
