import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ImpactIonizationCoefficientInput = {
  readonly electricFieldMVPerCm: number;
};

export type ImpactIonizationCoefficientOutput = {
  readonly ionizationCoefficientPerCm: number;
};

export const impactIonizationCoefficientExample = {
  input: { electricFieldMVPerCm: 1 },
  output: { ionizationCoefficientPerCm: 205276.30313413718 },
} satisfies ToolExample<
  ImpactIonizationCoefficientInput,
  ImpactIonizationCoefficientOutput
>;

export const calculateImpactIonizationCoefficient = (
  input: ImpactIonizationCoefficientInput,
): ImpactIonizationCoefficientOutput => {
  if (
    !Number.isFinite(input.electricFieldMVPerCm) ||
    input.electricFieldMVPerCm <= 0
  )
    simpleError(
      "electricFieldMVPerCm",
      "Electric field must be positive.",
      "invalid_electric_field",
    );
  const ionizationCoefficientPerCm =
    7.03e5 * Math.exp(-1.231 / input.electricFieldMVPerCm);
  if (ionizationCoefficientPerCm === 0)
    simpleError(
      "electricFieldMVPerCm",
      "The ionization coefficient is below the representable range.",
      "numeric_underflow",
    );
  if (!Number.isFinite(ionizationCoefficientPerCm))
    simpleError(
      "electricFieldMVPerCm",
      "The ionization coefficient is outside the representable range.",
      "numeric_range",
    );
  return { ionizationCoefficientPerCm };
};

export const impactIonizationCoefficientTool = createSimpleTool({
  calculate: (input) =>
    calculateImpactIonizationCoefficient({
      electricFieldMVPerCm: input.electricFieldMVPerCm as number,
    }),
  description:
    "Compute the silicon impact ionization coefficient from the electric field using the Chynoweth law.",
  id: "semiconductor/impact-ionization-coefficient",
  inputs: [
    {
      description: "Electric field in the depletion region.",
      format: "electric-field-mv-per-cm",
      id: "electricFieldMVPerCm",
      kind: "number",
      label: "Electric field",
      minimum: Number.MIN_VALUE,
      unit: "MV/cm",
    },
  ],
  outputs: [
    {
      description: "Impact ionization coefficient alpha.",
      format: "per-cm",
      id: "ionizationCoefficientPerCm",
      kind: "number",
      label: "Ionization coefficient",
      minimum: Number.MIN_VALUE,
      unit: "cm^-1",
    },
  ],
  title: "Impact Ionization Coefficient Calculator",
});
export const runImpactIonizationCoefficient =
  impactIonizationCoefficientTool.execute;
export default impactIonizationCoefficientTool;
