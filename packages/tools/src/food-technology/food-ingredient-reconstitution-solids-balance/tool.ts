import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly powderMass: number;
  readonly powderSolids: number;
  readonly targetSolids: number;
  readonly existingWater: number;
};
export type Output = {
  readonly totalTargetMass: number;
  readonly additionalWater: number;
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    powderMass: { type: "number", minimum: 0 },
    powderSolids: { type: "number", minimum: 0, maximum: 1 },
    targetSolids: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    existingWater: { type: "number", minimum: 0 },
  },
  required: ["powderMass", "powderSolids", "targetSolids", "existingWater"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTargetMass: { type: "number" },
    additionalWater: { type: "number" },
    feasible: { type: "boolean" },
  },
  required: ["totalTargetMass", "additionalWater", "feasible"],
} as const;
/** Calculate food ingredient reconstitution solids balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { powderMass, powderSolids, targetSolids, existingWater } = request;
  const compute = (): Output => {
    H.domain(powderMass >= 0);
    H.probability(powderSolids);
    H.domain(targetSolids > 0 && targetSolids <= 1 && existingWater >= 0);
    return {
      totalTargetMass: (powderMass * powderSolids) / targetSolids,
      additionalWater:
        (powderMass * powderSolids) / targetSolids - powderMass - existingWater,
      feasible:
        (powderMass * powderSolids) / targetSolids >=
        powderMass + existingWater,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    powderMass: 10,
    powderSolids: 0.9,
    targetSolids: 0.1,
    existingWater: 20,
  },
  output: { totalTargetMass: 90, additionalWater: 60, feasible: true },
} satisfies ToolExample<Input, Output>;
export const foodIngredientReconstitutionSolidsBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-technology/food-ingredient-reconstitution-solids-balance",
      title: "Food Ingredient Reconstitution Solids Balance Tool",
      description:
        "Calculate food ingredient reconstitution solids balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          powderMass: { type: "number", minimum: 0 },
          powderSolids: { type: "number", minimum: 0, maximum: 1 },
          targetSolids: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          existingWater: { type: "number", minimum: 0 },
        },
        required: [
          "powderMass",
          "powderSolids",
          "targetSolids",
          "existingWater",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalTargetMass: { type: "number" },
          additionalWater: { type: "number" },
          feasible: { type: "boolean" },
        },
        required: ["totalTargetMass", "additionalWater", "feasible"],
      },
      ports: {
        inputs: [
          {
            id: "powderMass",
            label: "Powder Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "powderSolids",
            label: "Powder Solids",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetSolids",
            label: "Target Solids",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "existingWater",
            label: "Existing Water",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalTargetMass",
            label: "Total Target Mass",
            valueType: { type: "number" },
          },
          {
            id: "additionalWater",
            label: "Additional Water",
            valueType: { type: "number" },
          },
          { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = foodIngredientReconstitutionSolidsBalanceTool.execute;
export default foodIngredientReconstitutionSolidsBalanceTool;
