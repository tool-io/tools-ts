import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMatchedPrecipitationDepth: number;
  readonly callerIndependentApplicableRechargeFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMatchedPrecipitationDepth",
    label: "Actual matched precipitation depth",
    kind: "number",
  },
  {
    id: "callerIndependentApplicableRechargeFraction",
    label: "Caller independent applicable recharge fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualMatchedPrecipitationDepth,
    "actualMatchedPrecipitationDepth",
  );
  fraction(
    input.callerIndependentApplicableRechargeFraction,
    "callerIndependentApplicableRechargeFraction",
  );
  return {
    value:
      input.actualMatchedPrecipitationDepth *
      input.callerIndependentApplicableRechargeFraction,
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
    actualMatchedPrecipitationDepth: 10,
    callerIndependentApplicableRechargeFraction: 0.2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/recharge-fraction-estimate",
  title: "Recharge Estimate from Precipitation Fraction Calculator",
  description:
    "Conditionalprecipitation\u00d7independentlycalibratedrechargefraction,no actualgroundwaterrechargeguaranteeor soilprocessmodel. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
