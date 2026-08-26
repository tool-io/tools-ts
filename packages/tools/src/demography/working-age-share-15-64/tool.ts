import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WorkingAgeShare1564Input = {
  readonly workingAgePopulation1564: number;
  readonly totalPopulation: number;
};

export type WorkingAgeShare1564Output = {
  readonly workingAgeSharePercent: number;
};

export const calculateWorkingAgeShare1564 = (
  input: WorkingAgeShare1564Input,
): WorkingAgeShare1564Output => {
  if (!(input.workingAgePopulation1564 >= 0))
    return simpleError(
      "workingAgePopulation1564",
      "Working-age population must be non-negative.",
      "invalid_population",
    );
  if (!(input.totalPopulation > 0))
    return simpleError(
      "totalPopulation",
      "Total population must be greater than zero.",
      "invalid_population",
    );
  if (input.workingAgePopulation1564 > input.totalPopulation)
    return simpleError(
      "workingAgePopulation1564",
      "The working-age population cannot exceed the total population.",
      "invalid_population",
    );
  return {
    workingAgeSharePercent:
      (100 * input.workingAgePopulation1564) / input.totalPopulation,
  };
};

export const workingAgeShare1564Example = {
  input: { workingAgePopulation1564: 6200, totalPopulation: 10000 },
  output: { workingAgeSharePercent: 62 },
} satisfies ToolExample<WorkingAgeShare1564Input, WorkingAgeShare1564Output>;

export const workingAgeShare1564Tool = createSimpleTool({
  id: "demography/working-age-share-15-64",
  title: "Working-Age Share Calculator",
  description:
    "Compute the share of a population aged 15-64 years, expressed as a percentage.",
  inputs: [
    {
      description: "Population aged 15-64 years.",
      id: "workingAgePopulation1564",
      kind: "number",
      label: "Pop 15-64",
      minimum: 0,
    },
    {
      description: "Total population of all ages.",
      id: "totalPopulation",
      kind: "number",
      label: "Total pop",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Share of the population aged 15-64, in percent.",
      id: "workingAgeSharePercent",
      kind: "number",
      label: "Working-age share",
    },
  ],
  calculate: (input) =>
    calculateWorkingAgeShare1564(input as unknown as WorkingAgeShare1564Input),
});

export const runWorkingAgeShare1564 = workingAgeShare1564Tool.execute;
export default workingAgeShare1564Tool;
