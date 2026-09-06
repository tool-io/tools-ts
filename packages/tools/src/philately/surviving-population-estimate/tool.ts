import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  integer,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly printRun: number;
  readonly independentlyEstimatedSurvivalFraction: number;
}>;
export type Output = Readonly<{ readonly expectedSurvivingPopulation: number }>;
const inputFields = [
  { id: "printRun", label: "Print run", kind: "number" },
  {
    id: "independentlyEstimatedSurvivalFraction",
    label: "Independently estimated survival fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.printRun, "printRun");
  fraction(
    input.independentlyEstimatedSurvivalFraction,
    "independentlyEstimatedSurvivalFraction",
  );
  integer(input.printRun, "print run");
  return {
    expectedSurvivingPopulation:
      input.printRun * input.independentlyEstimatedSurvivalFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  printRun: 10000,
  independentlyEstimatedSurvivalFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  expectedSurvivingPopulation: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/surviving-population-estimate",
  title: "Surviving Population Estimate from Print Run Fraction Calculator",
  description:
    "Expected surviving population under caller survival-fraction model, not an observed census or integer guarantee. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedSurvivingPopulation",
      label: "Expected surviving population",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      printRun: value.printRun as number,
      independentlyEstimatedSurvivalFraction:
        value.independentlyEstimatedSurvivalFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
