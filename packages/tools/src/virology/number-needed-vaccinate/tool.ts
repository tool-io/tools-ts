import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly unvaccinatedRisk: number;
  readonly vaccinatedRisk: number;
}>;
export type Output = Readonly<{
  readonly absoluteRiskReduction: number;
  readonly numberNeededToVaccinate: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.unvaccinatedRisk, "unvaccinatedRisk");
  fraction(input.vaccinatedRisk, "vaccinatedRisk");
  const absoluteRiskReduction = input.unvaccinatedRisk - input.vaccinatedRisk;
  positive(absoluteRiskReduction, "vaccinatedRisk");
  const reciprocal = 1 / absoluteRiskReduction;
  return {
    absoluteRiskReduction,
    numberNeededToVaccinate: Math.ceil(
      reciprocal - Number.EPSILON * 8 * Math.max(1, reciprocal),
    ),
  };
};
export const exampleInput = {
  unvaccinatedRisk: 0.1,
  vaccinatedRisk: 0.08,
} satisfies Input;
export const exampleOutput = {
  absoluteRiskReduction: 0.02,
  numberNeededToVaccinate: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/number-needed-vaccinate",
  title: "Number Needed Vaccinate",
  description:
    "Compute the rounded-up number needed to vaccinate for the specified absolute risks, population, outcome, and follow-up horizon.",
  inputs: [
    {
      id: "unvaccinatedRisk",
      label: "Unvaccinated risk",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "vaccinatedRisk",
      label: "Vaccinated risk",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "absoluteRiskReduction",
      label: "Absolute risk reduction",
      kind: "number",
    },
    {
      id: "numberNeededToVaccinate",
      label: "Number needed to vaccinate",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      unvaccinatedRisk: value.unvaccinatedRisk as number,
      vaccinatedRisk: value.vaccinatedRisk as number,
    }),
});
export const run = tool.execute;
export default tool;
