import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  expFinite,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerActualDecayConstantPerYear: number;
  readonly actualElapsedYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerActualDecayConstantPerYear",
    label: "Caller actual decay constant per year",
    kind: "number",
  },
  { id: "actualElapsedYears", label: "Actual elapsed years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerActualDecayConstantPerYear,
    "callerActualDecayConstantPerYear",
  );
  nonnegative(input.actualElapsedYears, "actualElapsedYears");
  return {
    value: expFinite(
      -input.callerActualDecayConstantPerYear * input.actualElapsedYears,
    ),
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
  input: { callerActualDecayConstantPerYear: 0.5, actualElapsedYears: 2 },
  output: { result: { value: 0.36787944117144233 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/remaining-parent-fraction",
  title: "Remaining Parent Isotope Fraction Calculator",
  description:
    "Closedmonoisotopicremainingparentfraction exp(\u2212\u03bbt),not fittedhalf-lifeor inferage/calendarcalibration. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
