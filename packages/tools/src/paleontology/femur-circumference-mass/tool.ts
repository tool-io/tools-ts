import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedFemurCircumference: number;
  readonly callerIndependentApplicableAllometricCoefficient: number;
  readonly callerIndependentApplicableExponent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedFemurCircumference",
    label: "Actual observed femur circumference",
    kind: "number",
  },
  {
    id: "callerIndependentApplicableAllometricCoefficient",
    label: "Caller independent applicable allometric coefficient",
    kind: "number",
  },
  {
    id: "callerIndependentApplicableExponent",
    label: "Caller independent applicable exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.actualObservedFemurCircumference,
    "actualObservedFemurCircumference",
  );
  positive(
    input.callerIndependentApplicableAllometricCoefficient,
    "callerIndependentApplicableAllometricCoefficient",
  );
  return {
    value:
      input.callerIndependentApplicableAllometricCoefficient *
      input.actualObservedFemurCircumference **
        input.callerIndependentApplicableExponent,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualObservedFemurCircumference: 2,
    callerIndependentApplicableAllometricCoefficient: 1,
    callerIndependentApplicableExponent: 2,
  },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/femur-circumference-mass",
  title: "Femur Circumference Body Mass Estimate Calculator",
  description:
    "Conditional femurcircumference massallometryactual A\u00d7x^b withindependentlyapplicabletaxon/unitscalibration,not inferredactual fossilweight or reuse unrelatedmammalline. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
