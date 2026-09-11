import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyFittedInitialConcentration: number;
  readonly callerIndependentlyFittedEliminationRatePerHour: number;
  readonly actualElapsedHours: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyFittedInitialConcentration",
    label: "Caller independently fitted initial concentration",
    kind: "number",
  },
  {
    id: "callerIndependentlyFittedEliminationRatePerHour",
    label: "Caller independently fitted elimination rate per hour",
    kind: "number",
  },
  { id: "actualElapsedHours", label: "Actual elapsed hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerIndependentlyFittedInitialConcentration, "C0");
  positive(input.callerIndependentlyFittedEliminationRatePerHour, "k");
  nonnegative(input.actualElapsedHours, "hours");
  return {
    conditionalOneCompartmentFiniteAuc:
      (input.callerIndependentlyFittedInitialConcentration *
        -Math.expm1(
          -input.callerIndependentlyFittedEliminationRatePerHour *
            input.actualElapsedHours,
        )) /
      input.callerIndependentlyFittedEliminationRatePerHour,
    conditionalOneCompartmentInfiniteAuc:
      input.callerIndependentlyFittedInitialConcentration /
      input.callerIndependentlyFittedEliminationRatePerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyFittedInitialConcentration: 10,
    callerIndependentlyFittedEliminationRatePerHour: 1,
    actualElapsedHours: 2,
  },
  output: {
    result: {
      conditionalOneCompartmentFiniteAuc: 8.646647167633873,
      conditionalOneCompartmentInfiniteAuc: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/one-compartment-auc",
  title: "One-Compartment AUC Calculator",
  description:
    "Exact finite/infinite AUCfor caller independently fitted C(t)=C0exp(\u2212kt) single-compartment model. No data fitting, dose selection, multiple-compartment claim or measured future concentration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
