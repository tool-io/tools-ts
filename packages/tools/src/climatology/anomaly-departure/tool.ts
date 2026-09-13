import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredClimateValue: number;
  readonly callerIndependentMatchedClimateNormal: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredClimateValue",
    label: "Actual measured climate value",
    kind: "number",
  },
  {
    id: "callerIndependentMatchedClimateNormal",
    label: "Caller independent matched climate normal",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    value:
      input.actualMeasuredClimateValue -
      input.callerIndependentMatchedClimateNormal,
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
    actualMeasuredClimateValue: 8,
    callerIndependentMatchedClimateNormal: 10,
  },
  output: { result: { value: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/anomaly-departure",
  title: "Anomaly Departure from Normal Calculator",
  description:
    "Signedactualdeparturefromindependently matchedbaseline,not standardizedz-score/referenceforecast. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
