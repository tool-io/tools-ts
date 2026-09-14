import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualRadiogenicDaughterToParentRatio: number;
  readonly callerApplicableUDecayConstantPerYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRadiogenicDaughterToParentRatio",
    label: "Actual radiogenic daughter to parent ratio",
    kind: "number",
  },
  {
    id: "callerApplicableUDecayConstantPerYear",
    label: "Caller applicable u decay constant per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualRadiogenicDaughterToParentRatio,
    "actualRadiogenicDaughterToParentRatio",
  );
  positive(
    input.callerApplicableUDecayConstantPerYear,
    "callerApplicableUDecayConstantPerYear",
  );
  return {
    value:
      Math.log1p(input.actualRadiogenicDaughterToParentRatio) /
      input.callerApplicableUDecayConstantPerYear,
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
    actualRadiogenicDaughterToParentRatio: 1,
    callerApplicableUDecayConstantPerYear: 1,
  },
  output: { result: { value: 0.6931471805599453 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/u-pb-age-ratio",
  title: "U-Pb Age from Parent-Daughter Ratio Calculator",
  description:
    "RestrictedsingleUPbsystem CLOSEDparent\u2013radiogenicdaughterage ln(1+D*/P)/\u03bb,commonPbanddisequilibriumindependentlyremoved;not concordia/discordiacertification. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
