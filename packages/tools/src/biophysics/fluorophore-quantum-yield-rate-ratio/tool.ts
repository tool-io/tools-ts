import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantumYield: number;
  readonly lifetime: number;
};
export type Output = {
  readonly radiativeRate: number;
  readonly nonradiativeRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantumYield: { type: "number", minimum: 0, maximum: 1 },
    lifetime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["quantumYield", "lifetime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radiativeRate: { type: "number" },
    nonradiativeRate: { type: "number" },
  },
  required: ["radiativeRate", "nonradiativeRate"],
} as const;
/** Calculate fluorophore quantum yield rate ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantumYield, lifetime } = request;
  const compute = (): Output => {
    H.probability(quantumYield);
    H.positive(lifetime);
    return {
      radiativeRate: quantumYield / lifetime,
      nonradiativeRate: (1 - quantumYield) / lifetime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantumYield: 0.4, lifetime: 0.2 },
  output: { radiativeRate: 2, nonradiativeRate: 2.9999999999999996 },
} satisfies ToolExample<Input, Output>;
export const fluorophoreQuantumYieldRateRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/fluorophore-quantum-yield-rate-ratio",
    title: "Fluorophore Quantum Yield Rate Ratio Tool",
    description:
      "Calculate fluorophore quantum yield rate ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantumYield: { type: "number", minimum: 0, maximum: 1 },
        lifetime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["quantumYield", "lifetime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radiativeRate: { type: "number" },
        nonradiativeRate: { type: "number" },
      },
      required: ["radiativeRate", "nonradiativeRate"],
    },
    ports: {
      inputs: [
        {
          id: "quantumYield",
          label: "Quantum Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lifetime",
          label: "Lifetime",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radiativeRate",
          label: "Radiative Rate",
          valueType: { type: "number" },
        },
        {
          id: "nonradiativeRate",
          label: "Nonradiative Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fluorophoreQuantumYieldRateRatioTool.execute;
export default fluorophoreQuantumYieldRateRatioTool;
