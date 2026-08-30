import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredDRatio: number;
  readonly initialDRatio: number;
  readonly symmetricRacemizationRatePerYear: number;
}>;
export type Output = Readonly<{
  readonly racemizationAgeScenarioYears: number;
}>;
const inputFields = [
  { id: "measuredDRatio", label: "Measured d ratio", kind: "number" },
  { id: "initialDRatio", label: "Initial d ratio", kind: "number" },
  {
    id: "symmetricRacemizationRatePerYear",
    label: "Symmetric racemization rate per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.symmetricRacemizationRatePerYear,
    "symmetricRacemizationRatePerYear",
  );
  nonnegative(input.measuredDRatio, "measuredDRatio");
  nonnegative(input.initialDRatio, "initialDRatio");
  if (input.initialDRatio > input.measuredDRatio || input.measuredDRatio >= 1)
    simpleError(
      "ratios",
      "0 ≤ initial D/L ≤ measured D/L < 1 required for symmetric closed-system kinetics.",
    );
  const transform = (r: number) => Math.log1p(r) - Math.log1p(-r);
  return {
    racemizationAgeScenarioYears:
      (transform(input.measuredDRatio) - transform(input.initialDRatio)) /
      (2 * input.symmetricRacemizationRatePerYear),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredDRatio: 0.5,
  initialDRatio: 0,
  symmetricRacemizationRatePerYear: 0.01,
} satisfies Input;
export const exampleOutput = {
  racemizationAgeScenarioYears: 54.93061443340549,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/amino-acid-racemization-age",
  title: "Amino Acid Racemization Age",
  description:
    "Infer symmetric reversible amino-acid racemization age from D/L using caller effective rate and initial ratio; assumes a closed system/fixed kinetic history, not a generic biological age.",
  inputs: inputFields,
  outputs: [
    {
      id: "racemizationAgeScenarioYears",
      label: "Racemization age scenario years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredDRatio: value.measuredDRatio as number,
      initialDRatio: value.initialDRatio as number,
      symmetricRacemizationRatePerYear:
        value.symmetricRacemizationRatePerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
