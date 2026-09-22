import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly envelopeVolume: number;
  readonly solidDensity: number;
  readonly absorbedMass: number;
  readonly liquidDensity: number;
};
export type Output = {
  readonly solidFraction: number;
  readonly accessibleFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", minimum: 0 },
    envelopeVolume: { type: "number", exclusiveMinimum: 0 },
    solidDensity: { type: "number", exclusiveMinimum: 0 },
    absorbedMass: { type: "number", minimum: 0 },
    liquidDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "dryMass",
    "envelopeVolume",
    "solidDensity",
    "absorbedMass",
    "liquidDensity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidFraction: { type: "number" },
    accessibleFraction: { type: "number" },
  },
  required: ["solidFraction", "accessibleFraction"],
} as const;
/** Supplied phantom solid and absorbed-liquid volume fractions, without inferring tissue porosity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, envelopeVolume, solidDensity, absorbedMass, liquidDensity } =
    request;
  const compute = (): Output => {
    H.domain(dryMass >= 0 && absorbedMass >= 0);
    H.positive(envelopeVolume);
    H.positive(solidDensity);
    H.positive(liquidDensity);
    return {
      solidFraction: dryMass / (envelopeVolume * solidDensity),
      accessibleFraction: absorbedMass / (envelopeVolume * liquidDensity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dryMass: 20,
    envelopeVolume: 100,
    solidDensity: 2,
    absorbedMass: 50,
    liquidDensity: 1,
  },
  output: { solidFraction: 0.1, accessibleFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const biofabricationPhantomPorosityMassFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biofabrication/biofabrication-phantom-porosity-mass-factor",
      title: "Biofabrication Phantom Porosity Mass Factor Tool",
      description:
        "Supplied phantom solid and absorbed-liquid volume fractions, without inferring tissue porosity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryMass: { type: "number", minimum: 0 },
          envelopeVolume: { type: "number", exclusiveMinimum: 0 },
          solidDensity: { type: "number", exclusiveMinimum: 0 },
          absorbedMass: { type: "number", minimum: 0 },
          liquidDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "dryMass",
          "envelopeVolume",
          "solidDensity",
          "absorbedMass",
          "liquidDensity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          solidFraction: { type: "number" },
          accessibleFraction: { type: "number" },
        },
        required: ["solidFraction", "accessibleFraction"],
      },
      ports: {
        inputs: [
          {
            id: "dryMass",
            label: "Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "envelopeVolume",
            label: "Envelope Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solidDensity",
            label: "Solid Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "absorbedMass",
            label: "Absorbed Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "liquidDensity",
            label: "Liquid Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "solidFraction",
            label: "Solid Fraction",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "accessibleFraction",
            label: "Accessible Fraction",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biofabricationPhantomPorosityMassFactorTool.execute;
export default biofabricationPhantomPorosityMassFactorTool;
