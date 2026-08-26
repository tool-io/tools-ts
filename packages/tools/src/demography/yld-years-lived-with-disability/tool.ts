import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type YldYearsLivedWithDisabilityInput = {
  readonly approach?: "prevalence" | "incidence";
  readonly cases: readonly number[];
  readonly disabilityWeights: readonly number[];
  readonly durationsYears?: readonly number[];
};

export type YldYearsLivedWithDisabilityOutput = {
  readonly yldTotal: number;
};

export const calculateYldYearsLivedWithDisability = (
  input: YldYearsLivedWithDisabilityInput,
): YldYearsLivedWithDisabilityOutput => {
  const approach = input.approach ?? "prevalence";
  const cases = input.cases;
  const weights = input.disabilityWeights;
  if (cases.length < 1)
    return simpleError(
      "cases",
      "Provide at least one condition class.",
      "invalid_list",
    );
  if (cases.length !== weights.length)
    return simpleError(
      "disabilityWeights",
      "Case counts and disability weights must have the same length.",
      "invalid_list",
    );
  for (const count of cases)
    if (!(count >= 0))
      return simpleError(
        "cases",
        "Case counts must be non-negative.",
        "invalid_list",
      );
  for (const weight of weights)
    if (!(weight >= 0 && weight <= 1))
      return simpleError(
        "disabilityWeights",
        "Disability weights must lie between zero and one.",
        "invalid_list",
      );
  if (approach === "incidence") {
    const durations = input.durationsYears ?? [];
    if (durations.length !== cases.length)
      return simpleError(
        "durationsYears",
        "Incidence-based YLD needs an average duration for every class.",
        "invalid_list",
      );
    let incidenceTotal = 0;
    for (let index = 0; index < cases.length; index += 1) {
      const duration = durations[index] as number;
      if (!(duration >= 0))
        return simpleError(
          "durationsYears",
          "Durations must be non-negative.",
          "invalid_list",
        );
      incidenceTotal +=
        (cases[index] as number) * (weights[index] as number) * duration;
    }
    return { yldTotal: incidenceTotal };
  }
  let prevalenceTotal = 0;
  for (let index = 0; index < cases.length; index += 1)
    prevalenceTotal += (cases[index] as number) * (weights[index] as number);
  return { yldTotal: prevalenceTotal };
};

export const yldYearsLivedWithDisabilityExample = {
  input: { cases: [4000, 1500, 300], disabilityWeights: [0.05, 0.2, 0.6] },
  output: { yldTotal: 680 },
} satisfies ToolExample<
  YldYearsLivedWithDisabilityInput,
  YldYearsLivedWithDisabilityOutput
>;

export const yldYearsLivedWithDisabilityTool = createSimpleTool({
  id: "demography/yld-years-lived-with-disability",
  title: "YLD Calculator",
  description:
    "Compute years lived with disability as the sum of case counts times disability weights, using either current prevalence or incidence times duration; prevalence is the default per the GBD 2010+ convention.",
  inputs: [
    {
      default: "prevalence",
      description:
        "Whether the case counts are prevalent cases or new incident cases.",
      enum: ["prevalence", "incidence"],
      id: "approach",
      kind: "string",
      label: "Approach",
    },
    {
      description: "Prevalent or incident case count per condition class.",
      id: "cases",
      kind: "numberList",
      label: "Cases",
    },
    {
      description: "Disability weight between zero and one for each class.",
      id: "disabilityWeights",
      kind: "numberList",
      label: "DW",
    },
    {
      default: [],
      description:
        "Average duration in years per class; required only for the incidence approach.",
      id: "durationsYears",
      kind: "numberList",
      label: "Durations",
    },
  ],
  outputs: [
    {
      description: "Total years lived with disability.",
      id: "yldTotal",
      kind: "number",
      label: "YLD",
    },
  ],
  calculate: (input) =>
    calculateYldYearsLivedWithDisability(
      input as unknown as YldYearsLivedWithDisabilityInput,
    ),
});

export const runYldYearsLivedWithDisability =
  yldYearsLivedWithDisabilityTool.execute;
export default yldYearsLivedWithDisabilityTool;
