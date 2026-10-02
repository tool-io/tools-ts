import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly servedMass: number;
  readonly boneInedibleMass: number;
  readonly edibleLeftoverMass: number;
  readonly nutrientPerEdibleMass: number;
};
export type Output = {
  readonly edibleServed: number;
  readonly consumedEdibleMass: number;
  readonly consumedNutrient: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    servedMass: { type: "number", minimum: 0 },
    boneInedibleMass: { type: "number", minimum: 0 },
    edibleLeftoverMass: { type: "number", minimum: 0 },
    nutrientPerEdibleMass: { type: "number", minimum: 0 },
  },
  required: [
    "servedMass",
    "boneInedibleMass",
    "edibleLeftoverMass",
    "nutrientPerEdibleMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edibleServed: { type: "number" },
    consumedEdibleMass: { type: "number" },
    consumedNutrient: { type: "number" },
  },
  required: ["edibleServed", "consumedEdibleMass", "consumedNutrient"],
} as const;
/** Explicit edible-portion food diary accounting, without nutrient recommendations or dietary adequacy assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    servedMass,
    boneInedibleMass,
    edibleLeftoverMass,
    nutrientPerEdibleMass,
  } = request;
  const compute = (): Output => {
    H.domain(
      servedMass >= 0 &&
        boneInedibleMass >= 0 &&
        edibleLeftoverMass >= 0 &&
        boneInedibleMass + edibleLeftoverMass <= servedMass &&
        nutrientPerEdibleMass >= 0,
    );
    return {
      edibleServed: servedMass - boneInedibleMass,
      consumedEdibleMass: servedMass - boneInedibleMass - edibleLeftoverMass,
      consumedNutrient:
        (servedMass - boneInedibleMass - edibleLeftoverMass) *
        nutrientPerEdibleMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    servedMass: 200,
    boneInedibleMass: 40,
    edibleLeftoverMass: 30,
    nutrientPerEdibleMass: 0.1,
  },
  output: { edibleServed: 160, consumedEdibleMass: 130, consumedNutrient: 13 },
} satisfies ToolExample<Input, Output>;
export const childMealRecordEdibleLeftoverTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/child-meal-record-edible-leftover",
    title: "Child Meal Record Edible Leftover Tool",
    description:
      "Explicit edible-portion food diary accounting, without nutrient recommendations or dietary adequacy assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        servedMass: { type: "number", minimum: 0 },
        boneInedibleMass: { type: "number", minimum: 0 },
        edibleLeftoverMass: { type: "number", minimum: 0 },
        nutrientPerEdibleMass: { type: "number", minimum: 0 },
      },
      required: [
        "servedMass",
        "boneInedibleMass",
        "edibleLeftoverMass",
        "nutrientPerEdibleMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edibleServed: { type: "number" },
        consumedEdibleMass: { type: "number" },
        consumedNutrient: { type: "number" },
      },
      required: ["edibleServed", "consumedEdibleMass", "consumedNutrient"],
    },
    ports: {
      inputs: [
        {
          id: "servedMass",
          label: "Served Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boneInedibleMass",
          label: "Bone Inedible Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edibleLeftoverMass",
          label: "Edible Leftover Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nutrientPerEdibleMass",
          label: "Nutrient Per Edible Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "edibleServed",
          label: "Edible Served",
          valueType: { type: "number" },
        },
        {
          id: "consumedEdibleMass",
          label: "Consumed Edible Mass",
          valueType: { type: "number" },
        },
        {
          id: "consumedNutrient",
          label: "Consumed Nutrient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = childMealRecordEdibleLeftoverTool.execute;
export default childMealRecordEdibleLeftoverTool;
