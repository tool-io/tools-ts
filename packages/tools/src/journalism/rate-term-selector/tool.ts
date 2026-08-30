import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly countsNewEvents: boolean;
  readonly countsExistingCases: boolean;
  readonly events: number;
  readonly population: number;
  readonly scale: number;
}>;
export type Output = Readonly<{
  readonly recommendedTerm: string;
  readonly calculatedRate: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.population <= 0 || input.scale <= 0)
    simpleError(
      "population",
      "Population and scale must be positive.",
      "invalid_denominator",
    );
  const recommendedTerm =
    input.countsNewEvents && !input.countsExistingCases
      ? "incidence"
      : input.countsExistingCases && !input.countsNewEvents
        ? "prevalence"
        : "ambiguous";
  return {
    recommendedTerm,
    calculatedRate: (input.events / input.population) * input.scale,
  };
};

export const exampleInput = {
  countsNewEvents: true,
  countsExistingCases: false,
  events: 50,
  population: 10000,
  scale: 100000,
} satisfies Input;
export const exampleOutput = {
  recommendedTerm: "incidence",
  calculatedRate: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      countsNewEvents: input.countsNewEvents as boolean,
      countsExistingCases: input.countsExistingCases as boolean,
      events: input.events as number,
      population: input.population as number,
      scale: input.scale as number,
    }),
  description:
    "Select incidence or prevalence terminology and calculate the supplied rate.",
  id: "journalism/rate-term-selector",
  inputs: [
    {
      id: "countsNewEvents",
      label: "Measure counts new events",
      kind: "boolean",
    },
    {
      id: "countsExistingCases",
      label: "Measure counts existing cases",
      kind: "boolean",
    },
    { id: "events", label: "Event count", kind: "number", minimum: 0 },
    {
      id: "population",
      label: "Population at risk",
      kind: "number",
      minimum: 0,
    },
    { id: "scale", label: "Rate scale", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "recommendedTerm",
      label: "Recommended epidemiological term",
      kind: "string",
      enum: ["incidence", "prevalence", "ambiguous"],
    },
    {
      id: "calculatedRate",
      label: "Calculated rate",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Rate-Term Selector",
});

export const run = tool.execute;
export default tool;
