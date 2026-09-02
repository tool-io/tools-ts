import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerEffectivePlanarWalkingSpeedMetersPerMinute: number;
  readonly callerAvailableWalkMinutes: number;
  readonly callerAlreadyBudgetedStopMinutes: number;
}>;
export type Output = Readonly<{
  readonly conditionalStraightLineCatchmentRadiusMeters: number;
}>;
const inputFields = [
  {
    id: "callerEffectivePlanarWalkingSpeedMetersPerMinute",
    label: "Caller effective planar walking speed meters per minute",
    kind: "number",
  },
  {
    id: "callerAvailableWalkMinutes",
    label: "Caller available walk minutes",
    kind: "number",
  },
  {
    id: "callerAlreadyBudgetedStopMinutes",
    label: "Caller already budgeted stop minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerEffectivePlanarWalkingSpeedMetersPerMinute,
    "callerEffectivePlanarWalkingSpeedMetersPerMinute",
  );
  nonnegative(input.callerAvailableWalkMinutes, "callerAvailableWalkMinutes");
  nonnegative(
    input.callerAlreadyBudgetedStopMinutes,
    "callerAlreadyBudgetedStopMinutes",
  );
  if (input.callerAlreadyBudgetedStopMinutes > input.callerAvailableWalkMinutes)
    simpleError("time", "Stops≤available time.");
  return {
    conditionalStraightLineCatchmentRadiusMeters:
      input.callerEffectivePlanarWalkingSpeedMetersPerMinute *
      (input.callerAvailableWalkMinutes -
        input.callerAlreadyBudgetedStopMinutes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEffectivePlanarWalkingSpeedMetersPerMinute: 50,
  callerAvailableWalkMinutes: 20,
  callerAlreadyBudgetedStopMinutes: 5,
} satisfies Input;
export const exampleOutput = {
  conditionalStraightLineCatchmentRadiusMeters: 750,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/site-catchment-radius-walk-time",
  title: "Site Catchment Radius Walk-Time Calculator",
  description:
    "Caller explicitly effective walk speed/time scenario after stops, not terrain/network catchment, travel safety or settlement access reconstruction. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalStraightLineCatchmentRadiusMeters",
      label: "Conditional straight line catchment radius meters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEffectivePlanarWalkingSpeedMetersPerMinute:
        value.callerEffectivePlanarWalkingSpeedMetersPerMinute as number,
      callerAvailableWalkMinutes: value.callerAvailableWalkMinutes as number,
      callerAlreadyBudgetedStopMinutes:
        value.callerAlreadyBudgetedStopMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
