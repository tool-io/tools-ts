import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radiativeRate: number;
  readonly nonradiativeRate: number;
};
export type Output = {
  readonly lifetime: number;
  readonly radiativeLifetime: number;
  readonly quantumYield: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radiativeRate: { type: "number", exclusiveMinimum: 0 },
    nonradiativeRate: { type: "number", minimum: 0 },
  },
  required: ["radiativeRate", "nonradiativeRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lifetime: { type: "number" },
    radiativeLifetime: { type: "number" },
    quantumYield: { type: "number" },
  },
  required: ["lifetime", "radiativeLifetime", "quantumYield"],
} as const;
/** Calculate fluorescence lifetime radiative rate factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radiativeRate, nonradiativeRate } = request;
  const compute = (): Output => {
    H.positive(radiativeRate);
    H.domain(nonradiativeRate >= 0);
    return {
      lifetime: 1 / (radiativeRate + nonradiativeRate),
      radiativeLifetime: 1 / radiativeRate,
      quantumYield: radiativeRate / (radiativeRate + nonradiativeRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radiativeRate: 2, nonradiativeRate: 3 },
  output: { lifetime: 0.2, radiativeLifetime: 0.5, quantumYield: 0.4 },
} satisfies ToolExample<Input, Output>;
export const fluorescenceLifetimeRadiativeRateFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/fluorescence-lifetime-radiative-rate-factor",
      title: "Fluorescence Lifetime Radiative Rate Factor Tool",
      description:
        "Calculate fluorescence lifetime radiative rate factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radiativeRate: { type: "number", exclusiveMinimum: 0 },
          nonradiativeRate: { type: "number", minimum: 0 },
        },
        required: ["radiativeRate", "nonradiativeRate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lifetime: { type: "number" },
          radiativeLifetime: { type: "number" },
          quantumYield: { type: "number" },
        },
        required: ["lifetime", "radiativeLifetime", "quantumYield"],
      },
      ports: {
        inputs: [
          {
            id: "radiativeRate",
            label: "Radiative Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nonradiativeRate",
            label: "Nonradiative Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "lifetime", label: "Lifetime", valueType: { type: "number" } },
          {
            id: "radiativeLifetime",
            label: "Radiative Lifetime",
            valueType: { type: "number" },
          },
          {
            id: "quantumYield",
            label: "Quantum Yield",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fluorescenceLifetimeRadiativeRateFactorTool.execute;
export default fluorescenceLifetimeRadiativeRateFactorTool;
