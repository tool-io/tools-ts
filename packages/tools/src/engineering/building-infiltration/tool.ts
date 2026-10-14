import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualBuildingAirVolumeCubicMeters: number;
  readonly callerIndependentObservedAirChangesPerHour: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualBuildingAirVolumeCubicMeters",
    label: "Actual building air volume cubic meters",
    kind: "number",
  },
  {
    id: "callerIndependentObservedAirChangesPerHour",
    label: "Caller independent observed air changes per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualBuildingAirVolumeCubicMeters,
    "actualBuildingAirVolumeCubicMeters",
  );
  nonnegative(
    input.callerIndependentObservedAirChangesPerHour,
    "callerIndependentObservedAirChangesPerHour",
  );
  return {
    value:
      input.actualBuildingAirVolumeCubicMeters *
      input.callerIndependentObservedAirChangesPerHour,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBuildingAirVolumeCubicMeters: 10,
    callerIndependentObservedAirChangesPerHour: 2,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/building-infiltration",
  title: "Building Infiltration Calculator",
  description:
    "Observed independently calibrated building volume\u00d7air changes/hour infiltration volume/hour, not blower door-to-natural conversion or forecast. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
