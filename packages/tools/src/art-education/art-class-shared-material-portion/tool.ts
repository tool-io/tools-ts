import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMaterial: number;
  readonly reserved: number;
  readonly learners: number;
  readonly sharedFraction: number;
};
export type Output = {
  readonly individualPortion: number;
  readonly sharedPool: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMaterial: { type: "number", minimum: 0 },
    reserved: { type: "number", minimum: 0 },
    learners: { type: "integer", minimum: 1 },
    sharedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["totalMaterial", "reserved", "learners", "sharedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    individualPortion: { type: "number" },
    sharedPool: { type: "number" },
  },
  required: ["individualPortion", "sharedPool"],
} as const;
/** Calculate art class shared material portion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMaterial, reserved, learners, sharedFraction } = request;
  const compute = (): Output => {
    H.domain(totalMaterial >= 0 && reserved >= 0 && reserved <= totalMaterial);
    H.integer(learners, 1);
    H.probability(sharedFraction);
    return {
      individualPortion:
        ((totalMaterial - reserved) * (1 - sharedFraction)) / learners,
      sharedPool: (totalMaterial - reserved) * sharedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalMaterial: 100,
    reserved: 20,
    learners: 10,
    sharedFraction: 0.25,
  },
  output: { individualPortion: 6, sharedPool: 20 },
} satisfies ToolExample<Input, Output>;
export const artClassSharedMaterialPortionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/art-class-shared-material-portion",
    title: "Art Class Shared Material Portion Tool",
    description:
      "Calculate art class shared material portion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMaterial: { type: "number", minimum: 0 },
        reserved: { type: "number", minimum: 0 },
        learners: { type: "integer", minimum: 1 },
        sharedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["totalMaterial", "reserved", "learners", "sharedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        individualPortion: { type: "number" },
        sharedPool: { type: "number" },
      },
      required: ["individualPortion", "sharedPool"],
    },
    ports: {
      inputs: [
        {
          id: "totalMaterial",
          label: "Total Material",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "learners",
          label: "Learners",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedFraction",
          label: "Shared Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "individualPortion",
          label: "Individual Portion",
          valueType: { type: "number" },
        },
        {
          id: "sharedPool",
          label: "Shared Pool",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artClassSharedMaterialPortionTool.execute;
export default artClassSharedMaterialPortionTool;
