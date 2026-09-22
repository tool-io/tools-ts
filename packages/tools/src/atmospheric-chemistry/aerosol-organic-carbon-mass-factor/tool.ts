import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly organicCarbonMass: number;
  readonly suppliedOmOcFactor: number;
  readonly totalParticleMass: number;
};
export type Output = {
  readonly organicMatterMass: number;
  readonly organicMatterFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    organicCarbonMass: { type: "number", minimum: 0 },
    suppliedOmOcFactor: { type: "number", minimum: 1 },
    totalParticleMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["organicCarbonMass", "suppliedOmOcFactor", "totalParticleMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    organicMatterMass: { type: "number" },
    organicMatterFraction: { type: "number" },
  },
  required: ["organicMatterMass", "organicMatterFraction"],
} as const;
/** Apply a supplied organic-matter/organic-carbon factor; no aerosol-composition factor is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { organicCarbonMass, suppliedOmOcFactor, totalParticleMass } = request;
  const compute = (): Output => {
    H.domain(organicCarbonMass >= 0 && suppliedOmOcFactor >= 1);
    H.positive(totalParticleMass);
    return {
      organicMatterMass: organicCarbonMass * suppliedOmOcFactor,
      organicMatterFraction:
        (organicCarbonMass * suppliedOmOcFactor) / totalParticleMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    organicCarbonMass: 10,
    suppliedOmOcFactor: 1.8,
    totalParticleMass: 100,
  },
  output: { organicMatterMass: 18, organicMatterFraction: 0.18 },
} satisfies ToolExample<Input, Output>;
export const aerosolOrganicCarbonMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/aerosol-organic-carbon-mass-factor",
    title: "Aerosol Organic Carbon Mass Factor Tool",
    description:
      "Apply a supplied organic-matter/organic-carbon factor; no aerosol-composition factor is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        organicCarbonMass: { type: "number", minimum: 0 },
        suppliedOmOcFactor: { type: "number", minimum: 1 },
        totalParticleMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "organicCarbonMass",
        "suppliedOmOcFactor",
        "totalParticleMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        organicMatterMass: { type: "number" },
        organicMatterFraction: { type: "number" },
      },
      required: ["organicMatterMass", "organicMatterFraction"],
    },
    ports: {
      inputs: [
        {
          id: "organicCarbonMass",
          label: "Organic Carbon Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOmOcFactor",
          label: "Supplied Om Oc Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalParticleMass",
          label: "Total Particle Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "organicMatterMass",
          label: "Organic Matter Mass",
          valueType: { type: "number" },
        },
        {
          id: "organicMatterFraction",
          label: "Organic Matter Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aerosolOrganicCarbonMassFactorTool.execute;
export default aerosolOrganicCarbonMassFactorTool;
