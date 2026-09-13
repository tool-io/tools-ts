import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLaterExtremeMinimumTemperatureC: number;
  readonly actualEarlierExtremeMinimumTemperatureC: number;
  readonly callerIndependentZoneStepC: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLaterExtremeMinimumTemperatureC",
    label: "Actual later extreme minimum temperature c",
    kind: "number",
  },
  {
    id: "actualEarlierExtremeMinimumTemperatureC",
    label: "Actual earlier extreme minimum temperature c",
    kind: "number",
  },
  {
    id: "callerIndependentZoneStepC",
    label: "Caller independent zone step c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.callerIndependentZoneStepC, "callerIndependentZoneStepC");
  return {
    value:
      (input.actualLaterExtremeMinimumTemperatureC -
        input.actualEarlierExtremeMinimumTemperatureC) /
      input.callerIndependentZoneStepC,
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
    actualLaterExtremeMinimumTemperatureC: -10,
    actualEarlierExtremeMinimumTemperatureC: -20,
    callerIndependentZoneStepC: 5,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/hardiness-zone-shift",
  title: "Hardiness Zone Shift Steps Calculator",
  description:
    "Signedhardinesszone-stepchangeactualextrememinimumcontrast/independentlyappropriatezone-width\u00b0C,not officialzoneclassificationor plantviability. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
