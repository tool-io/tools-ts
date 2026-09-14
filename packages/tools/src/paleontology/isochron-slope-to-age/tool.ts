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
  readonly actualIndependentlyFittedIsochronSlope: number;
  readonly callerApplicableDecayConstantPerYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyFittedIsochronSlope",
    label: "Actual independently fitted isochron slope",
    kind: "number",
  },
  {
    id: "callerApplicableDecayConstantPerYear",
    label: "Caller applicable decay constant per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyFittedIsochronSlope,
    "actualIndependentlyFittedIsochronSlope",
  );
  positive(
    input.callerApplicableDecayConstantPerYear,
    "callerApplicableDecayConstantPerYear",
  );
  return {
    value:
      Math.log1p(input.actualIndependentlyFittedIsochronSlope) /
      input.callerApplicableDecayConstantPerYear,
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
    actualIndependentlyFittedIsochronSlope: 1,
    callerApplicableDecayConstantPerYear: 1,
  },
  output: { result: { value: 0.6931471805599453 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/isochron-slope-to-age",
  title: "Isochron Slope to Age Converter",
  description:
    "InverseisochronAGESLOPEonlyln(1+s)/\u03bb,not compute ReOspointregression/inferclosed/commoninitialconditions. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
