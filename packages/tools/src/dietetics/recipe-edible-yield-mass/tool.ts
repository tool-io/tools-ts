import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly inedibleMass: number;
  readonly suppliedCookedYieldFactor: number;
};
export type Output = {
  readonly rawEdibleMass: number;
  readonly cookedEdibleMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    inedibleMass: { type: "number", minimum: 0 },
    suppliedCookedYieldFactor: { type: "number", minimum: 0 },
  },
  required: ["grossMass", "inedibleMass", "suppliedCookedYieldFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawEdibleMass: { type: "number" },
    cookedEdibleMass: { type: "number" },
  },
  required: ["rawEdibleMass", "cookedEdibleMass"],
} as const;
/** Apply supplied edible-trim and cooking-yield factors without inferring nutrient content or dietary adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, inedibleMass, suppliedCookedYieldFactor } = request;
  const compute = (): Output => {
    H.domain(
      grossMass >= 0 &&
        inedibleMass >= 0 &&
        inedibleMass <= grossMass &&
        suppliedCookedYieldFactor >= 0,
    );
    return {
      rawEdibleMass: grossMass - inedibleMass,
      cookedEdibleMass: (grossMass - inedibleMass) * suppliedCookedYieldFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 1000,
    inedibleMass: 200,
    suppliedCookedYieldFactor: 0.75,
  },
  output: { rawEdibleMass: 800, cookedEdibleMass: 600 },
} satisfies ToolExample<Input, Output>;
export const recipeEdibleYieldMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/recipe-edible-yield-mass",
    title: "Recipe Edible Yield Mass Tool",
    description:
      "Apply supplied edible-trim and cooking-yield factors without inferring nutrient content or dietary adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        inedibleMass: { type: "number", minimum: 0 },
        suppliedCookedYieldFactor: { type: "number", minimum: 0 },
      },
      required: ["grossMass", "inedibleMass", "suppliedCookedYieldFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawEdibleMass: { type: "number" },
        cookedEdibleMass: { type: "number" },
      },
      required: ["rawEdibleMass", "cookedEdibleMass"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inedibleMass",
          label: "Inedible Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCookedYieldFactor",
          label: "Supplied Cooked Yield Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawEdibleMass",
          label: "Raw Edible Mass",
          valueType: { type: "number" },
        },
        {
          id: "cookedEdibleMass",
          label: "Cooked Edible Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recipeEdibleYieldMassTool.execute;
export default recipeEdibleYieldMassTool;
