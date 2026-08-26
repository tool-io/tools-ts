import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KitagawaComponentDecompositionInput = {
  readonly population1: readonly number[];
  readonly rate1: readonly number[];
  readonly population2: readonly number[];
  readonly rate2: readonly number[];
};

export type KitagawaComponentDecompositionOutput = {
  readonly crudeRate1: number;
  readonly crudeRate2: number;
  readonly compositionEffect: number;
  readonly rateEffect: number;
  readonly totalDifference: number;
};

const checkPopulations = (values: readonly number[], field: string): void => {
  if (values.length === 0)
    simpleError(field, "Provide at least one age group.", "invalid_list");
  for (const value of values)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        field,
        "Age-group populations must be finite and non-negative.",
        "invalid_list",
      );
};

const checkRates = (values: readonly number[], field: string): void => {
  if (values.length === 0)
    simpleError(
      field,
      "Provide at least one age-specific rate.",
      "invalid_list",
    );
  for (const value of values)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        field,
        "Age-specific rates must be finite and non-negative.",
        "invalid_list",
      );
};

/**
 * Kitagawa (1955): with averaged compositions and rates,
 * r1 - r2 = sum(c_bar * dm) + sum(m_bar * dc), an exact identity.
 */
export const calculateKitagawaComponentDecomposition = (
  input: KitagawaComponentDecompositionInput,
): KitagawaComponentDecompositionOutput => {
  checkPopulations(input.population1, "population1");
  checkPopulations(input.population2, "population2");
  if (
    input.rate1.length !== input.population1.length ||
    input.rate2.length !== input.population2.length ||
    input.population1.length !== input.population2.length
  )
    simpleError(
      "rate2",
      "All four lists must cover one common set of age groups.",
      "invalid_list",
    );
  checkRates(input.rate1, "rate1");
  checkRates(input.rate2, "rate2");
  const total1 = input.population1.reduce((sum, value) => sum + value, 0);
  const total2 = input.population2.reduce((sum, value) => sum + value, 0);
  if (!(total1 > 0) || !(total2 > 0))
    simpleError(
      "population2",
      "Both populations must each sum to a positive total.",
      "invalid_list",
    );
  let crudeRate1 = 0;
  let crudeRate2 = 0;
  let compositionEffect = 0;
  let rateEffect = 0;
  for (let i = 0; i < input.population1.length; i += 1) {
    const c1 = input.population1[i]! / total1;
    const c2 = input.population2[i]! / total2;
    const m1 = input.rate1[i]!;
    const m2 = input.rate2[i]!;
    crudeRate1 += c1 * m1;
    crudeRate2 += c2 * m2;
    compositionEffect += ((m1 + m2) / 2) * (c1 - c2);
    rateEffect += ((c1 + c2) / 2) * (m1 - m2);
  }
  return {
    crudeRate1,
    crudeRate2,
    compositionEffect,
    rateEffect,
    totalDifference: crudeRate1 - crudeRate2,
  };
};

export const kitagawaComponentDecompositionExample = {
  input: {
    population1: [500, 500],
    rate1: [0.02, 0.08],
    population2: [800, 200],
    rate2: [0.02, 0.08],
  },
  output: {
    crudeRate1: 0.05,
    crudeRate2: 0.032,
    compositionEffect: 0.018,
    rateEffect: 0,
    totalDifference: 0.018000000000000002,
  },
} satisfies ToolExample<
  KitagawaComponentDecompositionInput,
  KitagawaComponentDecompositionOutput
>;

export const kitagawaComponentDecompositionTool = createSimpleTool({
  id: "demography/kitagawa-component-decomposition",
  title: "Kitagawa Component Decomposition",
  description:
    "Split the difference between two crude rates into an age-composition effect and a rate effect using Kitagawa's two-component decomposition with averaged compositions and rates.",
  inputs: [
    {
      description: "Population counts by age group in population 1.",
      id: "population1",
      kind: "numberList",
      label: "Population 1",
    },
    {
      description: "Age-specific rates in population 1.",
      id: "rate1",
      kind: "numberList",
      label: "Rates 1",
    },
    {
      description: "Population counts by age group in population 2.",
      id: "population2",
      kind: "numberList",
      label: "Population 2",
    },
    {
      description: "Age-specific rates in population 2.",
      id: "rate2",
      kind: "numberList",
      label: "Rates 2",
    },
  ],
  outputs: [
    {
      description:
        "Crude rate of population 1, sum of composition-weighted rates.",
      id: "crudeRate1",
      kind: "number",
      label: "Crude rate 1",
    },
    {
      description: "Crude rate of population 2.",
      id: "crudeRate2",
      kind: "number",
      label: "Crude rate 2",
    },
    {
      description:
        "Composition effect: composition differences weighted by average age-specific rates.",
      id: "compositionEffect",
      kind: "number",
      label: "Composition effect",
    },
    {
      description:
        "Rate effect: rate differences weighted by average population composition.",
      id: "rateEffect",
      kind: "number",
      label: "Rate effect",
    },
    {
      description: "Crude rate 1 minus crude rate 2, the decomposed total.",
      id: "totalDifference",
      kind: "number",
      label: "Difference",
    },
  ],
  calculate: (input) =>
    calculateKitagawaComponentDecomposition(
      input as unknown as KitagawaComponentDecompositionInput,
    ),
});

export const runKitagawaComponentDecomposition =
  kitagawaComponentDecompositionTool.execute;
export default kitagawaComponentDecompositionTool;
