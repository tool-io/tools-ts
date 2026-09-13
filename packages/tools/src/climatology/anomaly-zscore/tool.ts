import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedAnomaly: number;
  readonly callerIndependentBaselineMeanAnomaly: number;
  readonly callerIndependentBaselineAnomalySd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedAnomaly",
    label: "Actual observed anomaly",
    kind: "number",
  },
  {
    id: "callerIndependentBaselineMeanAnomaly",
    label: "Caller independent baseline mean anomaly",
    kind: "number",
  },
  {
    id: "callerIndependentBaselineAnomalySd",
    label: "Caller independent baseline anomaly sd",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentBaselineAnomalySd,
    "callerIndependentBaselineAnomalySd",
  );
  return {
    value:
      (input.actualObservedAnomaly -
        input.callerIndependentBaselineMeanAnomaly) /
      input.callerIndependentBaselineAnomalySd,
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
    actualObservedAnomaly: -2,
    callerIndependentBaselineMeanAnomaly: 0,
    callerIndependentBaselineAnomalySd: 2,
  },
  output: { result: { value: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/anomaly-zscore",
  title: "Standard Deviation of Anomaly Z-Score Calculator",
  description:
    "ActualanomalyzscoreagainstINDEPENDENTbaseline moments,not automaticallynormalizeanalysissample. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
