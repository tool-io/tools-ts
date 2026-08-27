import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepletedMantleModelAgeInput = {
  readonly nd143nd144Sample: number;
  readonly sm147nd144Sample: number;
  readonly dmNd143nd144?: number;
  readonly dmSm147nd144?: number;
};

export type DepletedMantleModelAgeOutput = {
  readonly modelAgeYears: number;
  readonly modelAgeGa: number;
};

const LAMBDA_SM147_PER_YEAR = 6.54e-12;
const DM_143ND_144ND_TODAY = 0.513151;
const DM_147SM_144ND = 0.2137;

/**
 * Single-stage Sm-Nd depleted-mantle model age (DePaolo):
 * exp(lambda*T) - 1 =
 *   ((143Nd/144Nd)_sample - (143Nd/144Nd)_DM) /
 *   ((147Sm/144Nd)_sample - (147Sm/144Nd)_DM),
 * T = ln(1 + x)/lambda.
 */
export const calculateDepletedMantleModelAge = (
  input: DepletedMantleModelAgeInput,
): DepletedMantleModelAgeOutput => {
  const dmNd = input.dmNd143nd144 ?? DM_143ND_144ND_TODAY;
  const dmSm = input.dmSm147nd144 ?? DM_147SM_144ND;
  if (!(input.nd143nd144Sample > 0))
    return simpleError(
      "nd143nd144Sample",
      "The sample 143Nd/144Nd ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(input.sm147nd144Sample > 0))
    return simpleError(
      "sm147nd144Sample",
      "The sample 147Sm/144Nd ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(dmNd > 0))
    return simpleError(
      "dmNd143nd144",
      "The depleted-mantle 143Nd/144Nd ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(dmSm > 0))
    return simpleError(
      "dmSm147nd144",
      "The depleted-mantle 147Sm/144Nd ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (input.sm147nd144Sample === dmSm)
    return simpleError(
      "sm147nd144Sample",
      "The sample and mantle Sm/Nd are identical; no model age exists.",
      "degenerate_model_age",
    );
  const x = (input.nd143nd144Sample - dmNd) / (input.sm147nd144Sample - dmSm);
  if (!(x > -1))
    return simpleError(
      "nd143nd144Sample",
      "No valid single-stage mantle differentiation age for these values.",
      "invalid_model_age",
    );
  const modelAgeYears = Math.log(1 + x) / LAMBDA_SM147_PER_YEAR;
  if (!(modelAgeYears >= 0))
    return simpleError(
      "nd143nd144Sample",
      "The computed model age is negative; the sample is more radiogenic than the mantle reservoir.",
      "invalid_model_age",
    );
  return { modelAgeYears, modelAgeGa: modelAgeYears / 1e9 };
};

export const depletedMantleModelAgeExample = {
  input: { nd143nd144Sample: 0.5115, sm147nd144Sample: 0.11 },
  output: {
    modelAgeYears: 2415216687.863492,
    modelAgeGa: 2.415216687863492,
  },
} satisfies ToolExample<
  DepletedMantleModelAgeInput,
  DepletedMantleModelAgeOutput
>;

export const depletedMantleModelAgeTool = createSimpleTool({
  id: "geology/depleted-mantle-model-age",
  title: "Geology Depleted Mantle Model Age Calculator",
  description:
    "Compute the single-stage Sm-Nd depleted-mantle (T_DM) model age of a sample from its Nd isotope ratios.",
  inputs: [
    {
      description: "Measured present-day 143Nd/144Nd ratio of the sample.",
      id: "nd143nd144Sample",
      kind: "number",
      label: "Sample 143Nd/144Nd",
      minimum: 0,
    },
    {
      description: "Measured 147Sm/144Nd ratio of the sample.",
      id: "sm147nd144Sample",
      kind: "number",
      label: "Sample 147Sm/144Nd",
      minimum: 0,
    },
    {
      default: 0.513151,
      description: "Present-day 143Nd/144Nd of the depleted mantle.",
      id: "dmNd143nd144",
      kind: "number",
      label: "DM 143Nd/144Nd",
      minimum: 0,
    },
    {
      default: 0.2137,
      description: "147Sm/144Nd of the depleted mantle.",
      id: "dmSm147nd144",
      kind: "number",
      label: "DM 147Sm/144Nd",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "T_DM model age in years.",
      id: "modelAgeYears",
      kind: "number",
      label: "T_DM (yr)",
    },
    {
      description: "T_DM model age in billions of years.",
      id: "modelAgeGa",
      kind: "number",
      label: "T_DM (Ga)",
    },
  ],
  calculate: (input) =>
    calculateDepletedMantleModelAge(
      input as unknown as DepletedMantleModelAgeInput,
    ),
});

export const runDepletedMantleModelAge = depletedMantleModelAgeTool.execute;
export default depletedMantleModelAgeTool;
