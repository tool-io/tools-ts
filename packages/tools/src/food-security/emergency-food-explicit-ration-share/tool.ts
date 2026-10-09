import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMass: number;
  readonly suppliedRationPerPerson: number;
};
export type Output = {
  readonly wholePersonRations: number;
  readonly remainingMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMass: { type: "number", minimum: 0 },
    suppliedRationPerPerson: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["availableMass", "suppliedRationPerPerson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholePersonRations: { type: "integer" },
    remainingMass: { type: "number" },
  },
  required: ["wholePersonRations", "remainingMass"],
} as const;
/** Count whole portions under an explicitly supplied ration mass without recommending ration or nutritional needs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMass, suppliedRationPerPerson } = request;
  const compute = (): Output => {
    H.domain(availableMass >= 0, "availableMass");
    (H.domain(suppliedRationPerPerson > 0, "suppliedRationPerPerson"),
      suppliedRationPerPerson);
    return (() => {
      const wholePersonRations = Math.floor(
        availableMass / suppliedRationPerPerson,
      );
      return {
        wholePersonRations,
        remainingMass:
          availableMass - wholePersonRations * suppliedRationPerPerson,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableMass: 105, suppliedRationPerPerson: 4 },
  output: { wholePersonRations: 26, remainingMass: 1 },
} satisfies ToolExample<Input, Output>;
export const emergencyFoodExplicitRationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["food-security", "food security", "agriculture"],
      keywords: ["food security", "agriculture"],
    },
    id: "food-security/emergency-food-explicit-ration-share",
    title: "Emergency Food Explicit Ration Share",
    description:
      "Count whole portions under an explicitly supplied ration mass without recommending ration or nutritional needs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMass: { type: "number", minimum: 0 },
        suppliedRationPerPerson: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["availableMass", "suppliedRationPerPerson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholePersonRations: { type: "integer" },
        remainingMass: { type: "number" },
      },
      required: ["wholePersonRations", "remainingMass"],
    },
    ports: {
      inputs: [
        {
          id: "availableMass",
          label: "Available Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRationPerPerson",
          label: "Supplied Ration Per Person",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wholePersonRations",
          label: "Whole Person Rations",
          valueType: { type: "integer" },
        },
        {
          id: "remainingMass",
          label: "Remaining Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = emergencyFoodExplicitRationShareTool.execute;
export default emergencyFoodExplicitRationShareTool;
