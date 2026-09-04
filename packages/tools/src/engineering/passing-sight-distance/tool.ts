import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly passingVehicleSpeedMSecond: number;
  readonly opposingVehicleSpeedMSecond: number;
  readonly callerObservedManeuverSeconds: number;
  readonly callerIndependentClearanceM: number;
}>;
export type Output = Readonly<{ readonly relativeMotionPassingSightM: number }>;
const inputFields = [
  {
    id: "passingVehicleSpeedMSecond",
    label: "Passing vehicle speed m second",
    kind: "number",
  },
  {
    id: "opposingVehicleSpeedMSecond",
    label: "Opposing vehicle speed m second",
    kind: "number",
  },
  {
    id: "callerObservedManeuverSeconds",
    label: "Caller observed maneuver seconds",
    kind: "number",
  },
  {
    id: "callerIndependentClearanceM",
    label: "Caller independent clearance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.passingVehicleSpeedMSecond, "passingVehicleSpeedMSecond");
  nonnegative(input.opposingVehicleSpeedMSecond, "opposingVehicleSpeedMSecond");
  nonnegative(
    input.callerObservedManeuverSeconds,
    "callerObservedManeuverSeconds",
  );
  nonnegative(input.callerIndependentClearanceM, "callerIndependentClearanceM");
  return {
    relativeMotionPassingSightM:
      (input.passingVehicleSpeedMSecond + input.opposingVehicleSpeedMSecond) *
        input.callerObservedManeuverSeconds +
      input.callerIndependentClearanceM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  passingVehicleSpeedMSecond: 20,
  opposingVehicleSpeedMSecond: 15,
  callerObservedManeuverSeconds: 5,
  callerIndependentClearanceM: 10,
} satisfies Input;
export const exampleOutput = {
  relativeMotionPassingSightM: 185,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/passing-sight-distance",
  title: "Passing Sight Distance Calculator",
  description:
    "Observed maneuver exposure/opposing travel plus independent clearance, not braking stopping sight distance or permission to overtake. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "relativeMotionPassingSightM",
      label: "Relative motion passing sight m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      passingVehicleSpeedMSecond: value.passingVehicleSpeedMSecond as number,
      opposingVehicleSpeedMSecond: value.opposingVehicleSpeedMSecond as number,
      callerObservedManeuverSeconds:
        value.callerObservedManeuverSeconds as number,
      callerIndependentClearanceM: value.callerIndependentClearanceM as number,
    }),
});
export const run = tool.execute;
export default tool;
