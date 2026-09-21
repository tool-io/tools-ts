import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly nitrogenFraction: number;
  readonly mineralizedFraction: number;
  readonly recoveredFraction: number;
};
export type Output = {
  readonly nitrogenMass: number;
  readonly availableNitrogen: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", minimum: 0 },
    nitrogenFraction: { type: "number", minimum: 0, maximum: 1 },
    mineralizedFraction: { type: "number", minimum: 0, maximum: 1 },
    recoveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "dryMass",
    "nitrogenFraction",
    "mineralizedFraction",
    "recoveredFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nitrogenMass: { type: "number" },
    availableNitrogen: { type: "number" },
  },
  required: ["nitrogenMass", "availableNitrogen"],
} as const;
/** Apply caller-supplied residue fractions; no fertilizer recommendation or mineralization forecast is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, nitrogenFraction, mineralizedFraction, recoveredFraction } =
    request;
  const compute = (): Output => {
    H.domain(dryMass >= 0);
    H.probability(nitrogenFraction);
    H.probability(mineralizedFraction);
    H.probability(recoveredFraction);
    return {
      nitrogenMass: dryMass * nitrogenFraction,
      availableNitrogen:
        dryMass * nitrogenFraction * mineralizedFraction * recoveredFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dryMass: 1000,
    nitrogenFraction: 0.03,
    mineralizedFraction: 0.5,
    recoveredFraction: 0.8,
  },
  output: { nitrogenMass: 30, availableNitrogen: 12 },
} satisfies ToolExample<Input, Output>;
export const legumeResidueNitrogenSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroecology/legume-residue-nitrogen-supplied-factor",
      title: "Legume Residue Nitrogen Supplied Factor Tool",
      description:
        "Apply caller-supplied residue fractions; no fertilizer recommendation or mineralization forecast is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryMass: { type: "number", minimum: 0 },
          nitrogenFraction: { type: "number", minimum: 0, maximum: 1 },
          mineralizedFraction: { type: "number", minimum: 0, maximum: 1 },
          recoveredFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "dryMass",
          "nitrogenFraction",
          "mineralizedFraction",
          "recoveredFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nitrogenMass: { type: "number" },
          availableNitrogen: { type: "number" },
        },
        required: ["nitrogenMass", "availableNitrogen"],
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
            id: "nitrogenFraction",
            label: "Nitrogen Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mineralizedFraction",
            label: "Mineralized Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recoveredFraction",
            label: "Recovered Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nitrogenMass",
            label: "Nitrogen Mass",
            valueType: { type: "number" },
          },
          {
            id: "availableNitrogen",
            label: "Available Nitrogen",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = legumeResidueNitrogenSuppliedFactorTool.execute;
export default legumeResidueNitrogenSuppliedFactorTool;
