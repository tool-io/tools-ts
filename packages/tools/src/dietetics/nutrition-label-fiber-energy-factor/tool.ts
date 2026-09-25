import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fiberGrams: number;
  readonly energyPerGram: number;
  readonly declaredEnergy: number;
};
export type Output = {
  readonly fiberEnergy: number;
  readonly otherEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fiberGrams: { type: "number", minimum: 0 },
    energyPerGram: { type: "number", minimum: 0 },
    declaredEnergy: { type: "number", minimum: 0 },
  },
  required: ["fiberGrams", "energyPerGram", "declaredEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fiberEnergy: { type: "number" },
    otherEnergy: { type: "number" },
  },
  required: ["fiberEnergy", "otherEnergy"],
} as const;
/** Caller-supplied labeling energy factor; no jurisdiction or fiber subtype rule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fiberGrams, energyPerGram, declaredEnergy } = request;
  const compute = (): Output => {
    H.domain(fiberGrams >= 0 && energyPerGram >= 0 && declaredEnergy >= 0);
    return {
      fiberEnergy: fiberGrams * energyPerGram,
      otherEnergy: declaredEnergy - fiberGrams * energyPerGram,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fiberGrams: 10, energyPerGram: 2, declaredEnergy: 100 },
  output: { fiberEnergy: 20, otherEnergy: 80 },
} satisfies ToolExample<Input, Output>;
export const nutritionLabelFiberEnergyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/nutrition-label-fiber-energy-factor",
    title: "Nutrition Label Fiber Energy Factor Tool",
    description:
      "Caller-supplied labeling energy factor; no jurisdiction or fiber subtype rule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fiberGrams: { type: "number", minimum: 0 },
        energyPerGram: { type: "number", minimum: 0 },
        declaredEnergy: { type: "number", minimum: 0 },
      },
      required: ["fiberGrams", "energyPerGram", "declaredEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fiberEnergy: { type: "number" },
        otherEnergy: { type: "number" },
      },
      required: ["fiberEnergy", "otherEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "fiberGrams",
          label: "Fiber Grams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energyPerGram",
          label: "Energy Per Gram",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "declaredEnergy",
          label: "Declared Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fiberEnergy",
          label: "Fiber Energy",
          valueType: { type: "number" },
        },
        {
          id: "otherEnergy",
          label: "Other Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutritionLabelFiberEnergyFactorTool.execute;
export default nutritionLabelFiberEnergyFactorTool;
