import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coreMass: number;
  readonly finalMass: number;
  readonly volatileMass: number;
  readonly appliedLiquidMass: number;
  readonly solidsFraction: number;
};
export type Output = {
  readonly dryGain: number;
  readonly theoreticalSolids: number;
  readonly transferFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coreMass: { type: "number", minimum: 0 },
    finalMass: { type: "number", minimum: 0 },
    volatileMass: { type: "number", minimum: 0 },
    appliedLiquidMass: { type: "number", exclusiveMinimum: 0 },
    solidsFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "coreMass",
    "finalMass",
    "volatileMass",
    "appliedLiquidMass",
    "solidsFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryGain: { type: "number" },
    theoreticalSolids: { type: "number" },
    transferFraction: { type: "number" },
  },
  required: ["dryGain", "theoreticalSolids", "transferFraction"],
} as const;
/** Observed coating mass transfer from supplied bench mass records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    coreMass,
    finalMass,
    volatileMass,
    appliedLiquidMass,
    solidsFraction,
  } = request;
  const compute = (): Output => {
    H.domain(coreMass >= 0 && finalMass >= 0 && volatileMass >= 0);
    H.positive(appliedLiquidMass);
    H.domain(solidsFraction > 0 && solidsFraction <= 1);
    return {
      dryGain: finalMass - coreMass - volatileMass,
      theoreticalSolids: appliedLiquidMass * solidsFraction,
      transferFraction:
        (finalMass - coreMass - volatileMass) /
        (appliedLiquidMass * solidsFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coreMass: 100,
    finalMass: 115,
    volatileMass: 5,
    appliedLiquidMass: 50,
    solidsFraction: 0.4,
  },
  output: { dryGain: 10, theoreticalSolids: 20, transferFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const coatingWeightGainSolidsFractionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-pharmacy/coating-weight-gain-solids-fraction-term",
      title: "Coating Weight Gain Solids Fraction Term Tool",
      description:
        "Observed coating mass transfer from supplied bench mass records.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coreMass: { type: "number", minimum: 0 },
          finalMass: { type: "number", minimum: 0 },
          volatileMass: { type: "number", minimum: 0 },
          appliedLiquidMass: { type: "number", exclusiveMinimum: 0 },
          solidsFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: [
          "coreMass",
          "finalMass",
          "volatileMass",
          "appliedLiquidMass",
          "solidsFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryGain: { type: "number" },
          theoreticalSolids: { type: "number" },
          transferFraction: { type: "number" },
        },
        required: ["dryGain", "theoreticalSolids", "transferFraction"],
      },
      ports: {
        inputs: [
          {
            id: "coreMass",
            label: "Core Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalMass",
            label: "Final Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volatileMass",
            label: "Volatile Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "appliedLiquidMass",
            label: "Applied Liquid Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solidsFraction",
            label: "Solids Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "dryGain", label: "Dry Gain", valueType: { type: "number" } },
          {
            id: "theoreticalSolids",
            label: "Theoretical Solids",
            valueType: { type: "number" },
          },
          {
            id: "transferFraction",
            label: "Transfer Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = coatingWeightGainSolidsFractionTermTool.execute;
export default coatingWeightGainSolidsFractionTermTool;
