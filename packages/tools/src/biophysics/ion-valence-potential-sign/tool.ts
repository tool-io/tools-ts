import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly valence: number;
  readonly potentialDifference: number;
  readonly elementaryCharge: number;
};
export type Output = {
  readonly energyChange: number;
  readonly energySign: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valence: { type: "integer" },
    potentialDifference: { type: "number" },
    elementaryCharge: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["valence", "potentialDifference", "elementaryCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyChange: { type: "number" },
    energySign: { type: "integer" },
  },
  required: ["energyChange", "energySign"],
} as const;
/** Formal electrostatic energy difference using a caller-supplied charge unit and voltage sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { valence, potentialDifference, elementaryCharge } = request;
  const compute = (): Output => {
    H.integer(valence, -Number.MAX_SAFE_INTEGER);
    H.positive(elementaryCharge);
    return {
      energyChange: valence * elementaryCharge * potentialDifference,
      energySign: Math.sign(valence) * Math.sign(potentialDifference),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { valence: 2, potentialDifference: -0.1, elementaryCharge: 1 },
  output: { energyChange: -0.2, energySign: -1 },
} satisfies ToolExample<Input, Output>;
export const ionValencePotentialSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/ion-valence-potential-sign",
    title: "Ion Valence Potential Sign Tool",
    description:
      "Formal electrostatic energy difference using a caller-supplied charge unit and voltage sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valence: { type: "integer" },
        potentialDifference: { type: "number" },
        elementaryCharge: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["valence", "potentialDifference", "elementaryCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyChange: { type: "number" },
        energySign: { type: "integer" },
      },
      required: ["energyChange", "energySign"],
    },
    ports: {
      inputs: [
        {
          id: "valence",
          label: "Valence",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "potentialDifference",
          label: "Potential Difference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elementaryCharge",
          label: "Elementary Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "energyChange",
          label: "Energy Change",
          valueType: { type: "number" },
        },
        {
          id: "energySign",
          label: "Energy Sign",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = ionValencePotentialSignTool.execute;
export default ionValencePotentialSignTool;
