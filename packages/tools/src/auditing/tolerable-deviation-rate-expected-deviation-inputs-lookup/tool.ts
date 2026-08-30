import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExpectedDeviationInput = {
  readonly expectedDeviationRatePercent: number;
  readonly populationSize: number;
  readonly tolerableDeviationRatePercent: number;
};

export type ExpectedDeviationOutput = {
  readonly expectedDeviations: number;
  readonly rateHeadroomPercent: number;
  readonly tolerableDeviationCount: number;
};

export const calculateExpectedDeviationInputs = (
  input: ExpectedDeviationInput,
): ExpectedDeviationOutput => {
  if (!Number.isSafeInteger(input.populationSize) || input.populationSize < 1)
    simpleError(
      "populationSize",
      "Population size must be a positive whole number.",
      "invalid_population_size",
    );
  for (const [field, value] of [
    ["expectedDeviationRatePercent", input.expectedDeviationRatePercent],
    ["tolerableDeviationRatePercent", input.tolerableDeviationRatePercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        `${field} must be from 0 through 100 percent.`,
        "invalid_deviation_rate",
      );
  return {
    expectedDeviations:
      (input.populationSize * input.expectedDeviationRatePercent) / 100,
    rateHeadroomPercent:
      input.tolerableDeviationRatePercent - input.expectedDeviationRatePercent,
    tolerableDeviationCount:
      (input.populationSize * input.tolerableDeviationRatePercent) / 100,
  };
};

export const expectedDeviationExample = {
  input: {
    expectedDeviationRatePercent: 2,
    populationSize: 1_000,
    tolerableDeviationRatePercent: 5,
  },
  output: {
    expectedDeviations: 20,
    rateHeadroomPercent: 3,
    tolerableDeviationCount: 50,
  },
} satisfies ToolExample<ExpectedDeviationInput, ExpectedDeviationOutput>;

export const expectedDeviationTool = createSimpleTool({
  calculate: (input) =>
    calculateExpectedDeviationInputs({
      expectedDeviationRatePercent:
        input.expectedDeviationRatePercent as number,
      populationSize: input.populationSize as number,
      tolerableDeviationRatePercent:
        input.tolerableDeviationRatePercent as number,
    }),
  description:
    "Convert expected and tolerable attribute-sampling percentages into fractional expected item counts and report their percentage-point headroom.",
  id: "auditing/tolerable-deviation-rate-expected-deviation-inputs-lookup",
  inputs: [
    {
      id: "expectedDeviationRatePercent",
      kind: "number",
      label: "Expected deviation rate",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    {
      id: "populationSize",
      kind: "integer",
      label: "Population size",
      minimum: 1,
    },
    {
      id: "tolerableDeviationRatePercent",
      kind: "number",
      label: "Tolerable deviation rate",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
  ],
  outputs: [
    {
      id: "expectedDeviations",
      kind: "number",
      label: "Expected deviations",
      minimum: 0,
    },
    {
      id: "rateHeadroomPercent",
      kind: "number",
      label: "Rate headroom",
      unit: "percent",
    },
    {
      id: "tolerableDeviationCount",
      kind: "number",
      label: "Tolerable deviation count",
      minimum: 0,
    },
  ],
  title: "Tolerable Deviation Rate Expected Deviation Inputs Lookup",
});

export const runExpectedDeviation = expectedDeviationTool.execute;
export default expectedDeviationTool;
