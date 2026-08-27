import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KArAgeInput = {
  readonly argon40Radiogenic: number;
  readonly potassium40: number;
};

export type KArAgeOutput = {
  readonly ageYears: number;
  readonly ageMa: number;
};

const LAMBDA_E_PER_YEAR = 0.581e-10;
const LAMBDA_BETA_PER_YEAR = 4.962e-10;
const LAMBDA_K40_PER_YEAR = LAMBDA_E_PER_YEAR + LAMBDA_BETA_PER_YEAR;

/**
 * Steiger & Jäger (1977) K-Ar age equation:
 * t = (1/lambda) ln(1 + (lambda/lambda_e) * (Ar-40* / K-40)).
 */
export const calculateKArAge = (input: KArAgeInput): KArAgeOutput => {
  if (!(input.argon40Radiogenic >= 0))
    return simpleError(
      "argon40Radiogenic",
      "Radiogenic argon-40 must be non-negative.",
      "invalid_amount",
    );
  if (!(input.potassium40 > 0))
    return simpleError(
      "potassium40",
      "Potassium-40 must be greater than zero.",
      "invalid_amount",
    );
  const ratio = input.argon40Radiogenic / input.potassium40;
  const ageYears =
    Math.log(1 + (LAMBDA_K40_PER_YEAR / LAMBDA_E_PER_YEAR) * ratio) /
    LAMBDA_K40_PER_YEAR;
  return { ageYears, ageMa: ageYears / 1e6 };
};

export const kaArAgeExample = {
  input: { argon40Radiogenic: 1.5, potassium40: 15 },
  output: { ageYears: 1208553951.5038369, ageMa: 1208.553951503837 },
} satisfies ToolExample<KArAgeInput, KArAgeOutput>;

export const kaArAgeTool = createSimpleTool({
  id: "geology/k-ar-age",
  title: "Geology K Ar Age Calculator",
  description:
    "Compute a K-Ar age from radiogenic Ar-40 and K-40 amounts using the Steiger & Jager (1977) decay constants.",
  inputs: [
    {
      description: "Radiogenic Ar-40 amount in the same units as potassium-40.",
      id: "argon40Radiogenic",
      kind: "number",
      label: "Radiogenic Ar-40",
      minimum: 0,
    },
    {
      description: "K-40 amount in the same units as radiogenic argon.",
      id: "potassium40",
      kind: "number",
      label: "K-40",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "K-Ar age in years.",
      id: "ageYears",
      kind: "number",
      label: "Age (yr)",
    },
    {
      description: "K-Ar age in millions of years.",
      id: "ageMa",
      kind: "number",
      label: "Age (Ma)",
    },
  ],
  calculate: (input) => calculateKArAge(input as unknown as KArAgeInput),
});

export const runKArAge = kaArAgeTool.execute;
export default kaArAgeTool;
