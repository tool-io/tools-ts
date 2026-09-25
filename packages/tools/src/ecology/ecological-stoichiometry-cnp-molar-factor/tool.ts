import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly carbonMass: number;
  readonly nitrogenMass: number;
  readonly phosphorusMass: number;
  readonly carbonMolarMass: number;
  readonly nitrogenMolarMass: number;
  readonly phosphorusMolarMass: number;
};
export type Output = {
  readonly carbonMoles: number;
  readonly nitrogenMoles: number;
  readonly phosphorusMoles: number;
  readonly carbonPerPhosphorus: number;
  readonly nitrogenPerPhosphorus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    carbonMass: { type: "number", minimum: 0 },
    nitrogenMass: { type: "number", minimum: 0 },
    phosphorusMass: { type: "number", exclusiveMinimum: 0 },
    carbonMolarMass: { type: "number", exclusiveMinimum: 0 },
    nitrogenMolarMass: { type: "number", exclusiveMinimum: 0 },
    phosphorusMolarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "carbonMass",
    "nitrogenMass",
    "phosphorusMass",
    "carbonMolarMass",
    "nitrogenMolarMass",
    "phosphorusMolarMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    carbonMoles: { type: "number" },
    nitrogenMoles: { type: "number" },
    phosphorusMoles: { type: "number" },
    carbonPerPhosphorus: { type: "number" },
    nitrogenPerPhosphorus: { type: "number" },
  },
  required: [
    "carbonMoles",
    "nitrogenMoles",
    "phosphorusMoles",
    "carbonPerPhosphorus",
    "nitrogenPerPhosphorus",
  ],
} as const;
/** C:N:P mole quantities and P-normalized ratios from explicitly supplied elemental masses and molar masses; no ecological reference ratio is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    carbonMass,
    nitrogenMass,
    phosphorusMass,
    carbonMolarMass,
    nitrogenMolarMass,
    phosphorusMolarMass,
  } = request;
  const compute = (): Output => {
    H.domain(carbonMass >= 0 && nitrogenMass >= 0);
    H.positive(phosphorusMass);
    H.positive(carbonMolarMass);
    H.positive(nitrogenMolarMass);
    H.positive(phosphorusMolarMass);
    return {
      carbonMoles: carbonMass / carbonMolarMass,
      nitrogenMoles: nitrogenMass / nitrogenMolarMass,
      phosphorusMoles: phosphorusMass / phosphorusMolarMass,
      carbonPerPhosphorus:
        (carbonMass * phosphorusMolarMass) / (carbonMolarMass * phosphorusMass),
      nitrogenPerPhosphorus:
        (nitrogenMass * phosphorusMolarMass) /
        (nitrogenMolarMass * phosphorusMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    carbonMass: 120,
    nitrogenMass: 28,
    phosphorusMass: 31,
    carbonMolarMass: 12,
    nitrogenMolarMass: 14,
    phosphorusMolarMass: 31,
  },
  output: {
    carbonMoles: 10,
    nitrogenMoles: 2,
    phosphorusMoles: 1,
    carbonPerPhosphorus: 10,
    nitrogenPerPhosphorus: 2,
  },
} satisfies ToolExample<Input, Output>;
export const ecologicalStoichiometryCnpMolarFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/ecological-stoichiometry-cnp-molar-factor",
      title: "Ecological Stoichiometry Cnp Molar Factor Tool",
      description:
        "C:N:P mole quantities and P-normalized ratios from explicitly supplied elemental masses and molar masses; no ecological reference ratio is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          carbonMass: { type: "number", minimum: 0 },
          nitrogenMass: { type: "number", minimum: 0 },
          phosphorusMass: { type: "number", exclusiveMinimum: 0 },
          carbonMolarMass: { type: "number", exclusiveMinimum: 0 },
          nitrogenMolarMass: { type: "number", exclusiveMinimum: 0 },
          phosphorusMolarMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "carbonMass",
          "nitrogenMass",
          "phosphorusMass",
          "carbonMolarMass",
          "nitrogenMolarMass",
          "phosphorusMolarMass",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          carbonMoles: { type: "number" },
          nitrogenMoles: { type: "number" },
          phosphorusMoles: { type: "number" },
          carbonPerPhosphorus: { type: "number" },
          nitrogenPerPhosphorus: { type: "number" },
        },
        required: [
          "carbonMoles",
          "nitrogenMoles",
          "phosphorusMoles",
          "carbonPerPhosphorus",
          "nitrogenPerPhosphorus",
        ],
      },
      ports: {
        inputs: [
          {
            id: "carbonMass",
            label: "Carbon Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nitrogenMass",
            label: "Nitrogen Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "phosphorusMass",
            label: "Phosphorus Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "carbonMolarMass",
            label: "Carbon Molar Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nitrogenMolarMass",
            label: "Nitrogen Molar Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "phosphorusMolarMass",
            label: "Phosphorus Molar Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "carbonMoles",
            label: "Carbon Moles",
            valueType: { type: "number" },
          },
          {
            id: "nitrogenMoles",
            label: "Nitrogen Moles",
            valueType: { type: "number" },
          },
          {
            id: "phosphorusMoles",
            label: "Phosphorus Moles",
            valueType: { type: "number" },
          },
          {
            id: "carbonPerPhosphorus",
            label: "Carbon Per Phosphorus",
            valueType: { type: "number" },
          },
          {
            id: "nitrogenPerPhosphorus",
            label: "Nitrogen Per Phosphorus",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ecologicalStoichiometryCnpMolarFactorTool.execute;
export default ecologicalStoichiometryCnpMolarFactorTool;
