import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArArAgeInput = {
  readonly jFactor: number;
  readonly radiogenicArgon40OverArgon39: number;
};

export type ArArAgeOutput = {
  readonly ageYears: number;
  readonly ageMa: number;
};

const LAMBDA_K40_PER_YEAR = 5.543e-10;

/**
 * Ar-40/Ar-39 age equation (Steiger & Jager decay constant):
 * t = (1/lambda) ln(1 + J x R), R = radiogenic Ar-40 over Ar-39 from K.
 */
export const calculateArArAge = (input: ArArAgeInput): ArArAgeOutput => {
  if (!(input.jFactor > 0))
    return simpleError(
      "jFactor",
      "The irradiation parameter J must be greater than zero.",
      "invalid_j",
    );
  if (!(input.radiogenicArgon40OverArgon39 >= 0))
    return simpleError(
      "radiogenicArgon40OverArgon39",
      "The radiogenic Ar-40/Ar-39 ratio must be non-negative.",
      "invalid_ratio",
    );
  const ageYears =
    Math.log(1 + input.jFactor * input.radiogenicArgon40OverArgon39) /
    LAMBDA_K40_PER_YEAR;
  return { ageYears, ageMa: ageYears / 1e6 };
};

export const arArAgeExample = {
  input: { jFactor: 0.01, radiogenicArgon40OverArgon39: 5 },
  output: { ageYears: 88021223.47001992, ageMa: 88.02122347001992 },
} satisfies ToolExample<ArArAgeInput, ArArAgeOutput>;

export const arArAgeTool = createSimpleTool({
  id: "geology/ar-ar-age",
  title: "Geology Ar Ar Age Calculator",
  description:
    "Compute an Ar-40/Ar-39 age from the irradiation parameter J and the radiogenic Ar-40/Ar-39 ratio.",
  inputs: [
    {
      description: "Neutron fluence irradiation parameter J.",
      id: "jFactor",
      kind: "number",
      label: "J factor",
      minimum: 0,
    },
    {
      description:
        "Radiogenic Ar-40 divided by reactor-produced Ar-39 from potassium.",
      id: "radiogenicArgon40OverArgon39",
      kind: "number",
      label: "Ar-40*/Ar-39",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Ar-Ar age in years.",
      id: "ageYears",
      kind: "number",
      label: "Age (yr)",
    },
    {
      description: "Ar-Ar age in millions of years.",
      id: "ageMa",
      kind: "number",
      label: "Age (Ma)",
    },
  ],
  calculate: (input) => calculateArArAge(input as unknown as ArArAgeInput),
});

export const runArArAge = arArAgeTool.execute;
export default arArAgeTool;
