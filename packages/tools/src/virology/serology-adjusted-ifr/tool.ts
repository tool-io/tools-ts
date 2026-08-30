import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly seropositiveCount: number;
  readonly sampleCount: number;
  readonly sensitivityFraction: number;
  readonly specificityFraction: number;
  readonly populationSize: number;
  readonly deaths: number;
}>;
export type Output = Readonly<{
  readonly adjustedInfectionFraction: number;
  readonly estimatedInfections: number;
  readonly infectionFatalityPercent: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.seropositiveCount, "seropositiveCount");
  count(input.sampleCount, "sampleCount", 1);
  count(input.populationSize, "populationSize", 1);
  count(input.deaths, "deaths");
  fraction(input.sensitivityFraction, "sensitivityFraction");
  fraction(input.specificityFraction, "specificityFraction");
  if (
    input.seropositiveCount > input.sampleCount ||
    input.deaths > input.populationSize ||
    input.sensitivityFraction + input.specificityFraction <= 1
  )
    simpleError(
      "sensitivityFraction",
      "Valid counts and a positive assay Youden index required.",
    );
  const adjustedInfectionFraction =
    (input.seropositiveCount / input.sampleCount +
      input.specificityFraction -
      1) /
    (input.sensitivityFraction + input.specificityFraction - 1);
  if (adjustedInfectionFraction <= 0 || adjustedInfectionFraction > 1)
    simpleError(
      "seropositiveCount",
      "Assay-adjusted prevalence must be in (0,1], without silent clipping.",
    );
  const estimatedInfections = adjustedInfectionFraction * input.populationSize;
  if (input.deaths > estimatedInfections)
    simpleError("deaths", "Deaths cannot exceed estimated infections.");
  return {
    adjustedInfectionFraction,
    estimatedInfections,
    infectionFatalityPercent: (100 * input.deaths) / estimatedInfections,
  };
};
export const exampleInput = {
  seropositiveCount: 180,
  sampleCount: 1000,
  sensitivityFraction: 0.9,
  specificityFraction: 0.9,
  populationSize: 100000,
  deaths: 100,
} satisfies Input;
export const exampleOutput = {
  adjustedInfectionFraction: 0.1,
  estimatedInfections: 10000,
  infectionFatalityPercent: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/serology-adjusted-ifr",
  title: "Serology Adjusted IFR",
  description:
    "Estimate IFR from assay-adjusted seroprevalence and aligned population deaths; assumes representative sampling and compatible time cohorts.",
  inputs: [
    {
      id: "seropositiveCount",
      label: "Seropositive count",
      kind: "integer",
      minimum: 0,
    },
    { id: "sampleCount", label: "Sample count", kind: "integer", minimum: 1 },
    {
      id: "sensitivityFraction",
      label: "Sensitivity fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "specificityFraction",
      label: "Specificity fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "populationSize",
      label: "Population size",
      kind: "integer",
      minimum: 1,
    },
    { id: "deaths", label: "Deaths", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "adjustedInfectionFraction",
      label: "Adjusted infection fraction",
      kind: "number",
    },
    {
      id: "estimatedInfections",
      label: "Estimated infections",
      kind: "number",
    },
    {
      id: "infectionFatalityPercent",
      label: "Infection fatality percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      seropositiveCount: value.seropositiveCount as number,
      sampleCount: value.sampleCount as number,
      sensitivityFraction: value.sensitivityFraction as number,
      specificityFraction: value.specificityFraction as number,
      populationSize: value.populationSize as number,
      deaths: value.deaths as number,
    }),
});
export const run = tool.execute;
export default tool;
