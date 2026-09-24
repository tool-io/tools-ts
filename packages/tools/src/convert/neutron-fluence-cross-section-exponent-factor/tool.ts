import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fluence: number; readonly crossSection: number };
export type Output = {
  readonly opticalDepth: number;
  readonly unreactedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fluence: { type: "number", minimum: 0 },
    crossSection: { type: "number", minimum: 0 },
  },
  required: ["fluence", "crossSection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opticalDepth: { type: "number" },
    unreactedFraction: { type: "number" },
  },
  required: ["opticalDepth", "unreactedFraction"],
} as const;
/** Multiply compatible neutron fluence and interaction cross section and return the ideal independent-interaction survival factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fluence, crossSection } = request;
  const compute = (): Output => {
    H.domain(fluence >= 0 && crossSection >= 0);
    const opticalDepth = fluence * crossSection;
    return { opticalDepth, unreactedFraction: Math.exp(-opticalDepth) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fluence: 100000000000000000000, crossSection: 1e-20 },
  output: { opticalDepth: 1, unreactedFraction: 0.36787944117144233 },
} satisfies ToolExample<Input, Output>;
export const neutronFluenceCrossSectionExponentFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/neutron-fluence-cross-section-exponent-factor",
      title: "Neutron Fluence Cross Section Exponent Factor Tool",
      description:
        "Multiply compatible neutron fluence and interaction cross section and return the ideal independent-interaction survival factor.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fluence: { type: "number", minimum: 0 },
          crossSection: { type: "number", minimum: 0 },
        },
        required: ["fluence", "crossSection"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opticalDepth: { type: "number" },
          unreactedFraction: { type: "number" },
        },
        required: ["opticalDepth", "unreactedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "fluence",
            label: "Fluence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "crossSection",
            label: "Cross Section",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "opticalDepth",
            label: "Optical Depth",
            valueType: { type: "number" },
          },
          {
            id: "unreactedFraction",
            label: "Unreacted Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = neutronFluenceCrossSectionExponentFactorTool.execute;
export default neutronFluenceCrossSectionExponentFactorTool;
