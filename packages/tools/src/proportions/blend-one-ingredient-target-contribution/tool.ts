import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly concentration: number;
  readonly targetConcentration: number;
};
export type Output = { readonly excessSolute: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    concentration: { type: "number", minimum: 0, maximum: 1 },
    targetConcentration: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["amount", "concentration", "targetConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { excessSolute: { type: "number" } },
  required: ["excessSolute"],
} as const;
/** Calculate blend one ingredient target contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, concentration, targetConcentration } = request;
  const compute = (): Output => {
    H.domain(amount >= 0);
    H.probability(concentration);
    H.probability(targetConcentration);
    return { excessSolute: amount * (concentration - targetConcentration) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 20, concentration: 0.6, targetConcentration: 0.4 },
  output: { excessSolute: 3.999999999999999 },
} satisfies ToolExample<Input, Output>;
export const blendOneIngredientTargetContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/blend-one-ingredient-target-contribution",
      title: "Blend One Ingredient Target Contribution Tool",
      description:
        "Calculate blend one ingredient target contribution from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          amount: { type: "number", minimum: 0 },
          concentration: { type: "number", minimum: 0, maximum: 1 },
          targetConcentration: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["amount", "concentration", "targetConcentration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { excessSolute: { type: "number" } },
        required: ["excessSolute"],
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
            id: "concentration",
            label: "Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetConcentration",
            label: "Target Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "excessSolute",
            label: "Excess Solute",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = blendOneIngredientTargetContributionTool.execute;
export default blendOneIngredientTargetContributionTool;
