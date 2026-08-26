import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GenerationLengthTIntrinsicInput = {
  readonly method?: "lotka" | "meanAgeMaternity";
  readonly netReproductionRate?: number;
  readonly intrinsicGrowthRate?: number;
  readonly asfr?: readonly number[];
  readonly personYearsLx?: readonly number[];
  readonly startingAge?: number;
  readonly classWidth?: number;
};

export type GenerationLengthTIntrinsicOutput = {
  readonly generationLengthYears: number;
};

export const calculateGenerationLengthTIntrinsic = (
  input: GenerationLengthTIntrinsicInput,
): GenerationLengthTIntrinsicOutput => {
  const method = input.method ?? "lotka";
  if (method === "meanAgeMaternity") {
    const asfr = input.asfr ?? [];
    const personYearsLx = input.personYearsLx ?? [];
    const startingAge = input.startingAge ?? 15;
    const classWidth = input.classWidth ?? 5;
    if (!(classWidth > 0))
      simpleError(
        "classWidth",
        "The age-class width must be greater than zero.",
        "invalid_interval",
      );
    if (asfr.length === 0 || asfr.length !== personYearsLx.length)
      simpleError(
        "asfr",
        "Provide aligned fertility and person-years lists for the mean-age-of-maternity method.",
        "invalid_list",
      );
    for (const value of asfr)
      if (!(Number.isFinite(value) && value >= 0))
        simpleError(
          "asfr",
          "Fertility rates must be finite and non-negative.",
          "invalid_schedule",
        );
    for (const value of personYearsLx)
      if (!(Number.isFinite(value) && value >= 0))
        simpleError(
          "personYearsLx",
          "Person-years values must be finite and non-negative.",
          "invalid_schedule",
        );
    if (!(Number.isFinite(startingAge) && startingAge >= 0))
      simpleError(
        "startingAge",
        "The starting age must be finite and non-negative.",
        "invalid_age",
      );
    const weights = asfr.map((rate, index) => rate * personYearsLx[index]!);
    let netReproductionRate = 0;
    for (const weight of weights) netReproductionRate += weight;
    if (!(netReproductionRate > 0))
      simpleError(
        "asfr",
        "The weighted maternity sum must be positive.",
        "invalid_schedule",
      );
    let weightedAgeSum = 0;
    for (let index = 0; index < weights.length; index += 1)
      weightedAgeSum +=
        (startingAge + classWidth * (index + 0.5)) * weights[index]!;
    return { generationLengthYears: weightedAgeSum / netReproductionRate };
  }
  const netReproductionRate = input.netReproductionRate ?? 1;
  const intrinsicGrowthRate = input.intrinsicGrowthRate ?? 0;
  if (!(netReproductionRate > 0))
    simpleError(
      "netReproductionRate",
      "The net reproduction rate must be positive.",
      "invalid_nrr",
    );
  if (intrinsicGrowthRate === 0)
    simpleError(
      "intrinsicGrowthRate",
      "A zero growth rate gives an infinite Lotka generation length; use the mean-age method instead.",
      "invalid_rate",
    );
  if (!Number.isFinite(intrinsicGrowthRate))
    simpleError(
      "intrinsicGrowthRate",
      "The intrinsic growth rate must be finite.",
      "invalid_rate",
    );
  const generationLengthYears =
    Math.log(netReproductionRate) / intrinsicGrowthRate;
  if (!(generationLengthYears > 0))
    simpleError(
      "intrinsicGrowthRate",
      "The net reproduction rate and growth rate must imply a positive generation length.",
      "inconsistent_inputs",
    );
  return { generationLengthYears };
};

export const generationLengthTIntrinsicExample = {
  input: {
    method: "lotka",
    netReproductionRate: 1.4,
    intrinsicGrowthRate: 0.02,
  },
  output: { generationLengthYears: 16.823611831060642 },
} satisfies ToolExample<
  GenerationLengthTIntrinsicInput,
  GenerationLengthTIntrinsicOutput
>;

export const generationLengthTIntrinsicTool = createSimpleTool({
  id: "demography/generation-length-t-intrinsic",
  title: "Generation Length T Intrinsic Calculator",
  description:
    "Compute the intrinsic mean generation length T either as ln(NRR)/r from Lotka's relation or directly as the mean age of mothers at childbirth of the net maternity schedule.",
  inputs: [
    {
      default: "lotka",
      description:
        "Formula choice: Lotka's ln(NRR)/r or the mean age of maternity.",
      enum: ["lotka", "meanAgeMaternity"],
      id: "method",
      kind: "string",
      label: "Method",
    },
    {
      default: 1,
      description: "Net reproduction rate NRR (Lotka method).",
      id: "netReproductionRate",
      kind: "number",
      label: "NRR",
      minimum: 0,
    },
    {
      default: 0,
      description: "Intrinsic annual growth rate r (Lotka method).",
      id: "intrinsicGrowthRate",
      kind: "number",
      label: "Growth rate r",
    },
    {
      default: [],
      description: "Fertility rates per woman per year (mean-age method).",
      id: "asfr",
      kind: "numberList",
      label: "ASFR",
    },
    {
      default: [],
      description:
        "Life-table person-years L(x) aligned with the rates (mean-age method).",
      id: "personYearsLx",
      kind: "numberList",
      label: "L(x)",
    },
    {
      default: 15,
      description: "Starting age of the first class in years.",
      id: "startingAge",
      kind: "number",
      label: "Start age",
      minimum: 0,
    },
    {
      default: 5,
      description: "Width of each age class in years.",
      id: "classWidth",
      kind: "number",
      label: "Class width",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Mean generation length in years.",
      id: "generationLengthYears",
      kind: "number",
      label: "T",
    },
  ],
  calculate: (input) =>
    calculateGenerationLengthTIntrinsic(
      input as unknown as GenerationLengthTIntrinsicInput,
    ),
});

export const runGenerationLengthTIntrinsic =
  generationLengthTIntrinsicTool.execute;
export default generationLengthTIntrinsicTool;
