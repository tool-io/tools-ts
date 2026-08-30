import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count } from "../shared.js";

export type Input = Readonly<{
  readonly confirmedCases: number;
  readonly deaths: number;
  readonly recoveredCases: number;
}>;
export type Output = Readonly<{
  readonly crudeCaseFatalityPercent: number;
  readonly resolvedCaseFatalityPercent: number;
  readonly unresolvedCases: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.confirmedCases, "confirmedCases", 1);
  count(input.deaths, "deaths");
  count(input.recoveredCases, "recoveredCases");
  if (input.deaths + input.recoveredCases > input.confirmedCases)
    simpleError(
      "confirmedCases",
      "Resolved outcomes cannot exceed the confirmed cohort.",
    );
  positive(input.deaths + input.recoveredCases, "recoveredCases");
  return {
    crudeCaseFatalityPercent: (100 * input.deaths) / input.confirmedCases,
    resolvedCaseFatalityPercent:
      (100 * input.deaths) / (input.deaths + input.recoveredCases),
    unresolvedCases: input.confirmedCases - input.deaths - input.recoveredCases,
  };
};
export const exampleInput = {
  confirmedCases: 100,
  deaths: 10,
  recoveredCases: 70,
} satisfies Input;
export const exampleOutput = {
  crudeCaseFatalityPercent: 10,
  resolvedCaseFatalityPercent: 12.5,
  unresolvedCases: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/confirmed-case-outcome-fatality",
  title: "Confirmed Case Outcome Fatality",
  description:
    "Compare crude and resolved-outcome CFR within one confirmed-case cohort; neither corrects ascertainment or outcome lag.",
  inputs: [
    {
      id: "confirmedCases",
      label: "Confirmed cases",
      kind: "integer",
      minimum: 1,
    },
    { id: "deaths", label: "Deaths", kind: "integer", minimum: 0 },
    {
      id: "recoveredCases",
      label: "Recovered cases",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "crudeCaseFatalityPercent",
      label: "Crude case fatality percent",
      kind: "number",
    },
    {
      id: "resolvedCaseFatalityPercent",
      label: "Resolved case fatality percent",
      kind: "number",
    },
    { id: "unresolvedCases", label: "Unresolved cases", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      confirmedCases: value.confirmedCases as number,
      deaths: value.deaths as number,
      recoveredCases: value.recoveredCases as number,
    }),
});
export const run = tool.execute;
export default tool;
