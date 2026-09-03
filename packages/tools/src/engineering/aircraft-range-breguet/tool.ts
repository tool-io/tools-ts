import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerCruiseSpeedMSecond: number;
  readonly callerThrustSpecificFuelPerSecond: number;
  readonly callerCruiseLiftDragRatio: number;
  readonly initialAircraftMassKg: number;
  readonly finalAircraftMassKg: number;
}>;
export type Output = Readonly<{ readonly jetBreguetRangeM: number }>;
const inputFields = [
  {
    id: "callerCruiseSpeedMSecond",
    label: "Caller cruise speed m second",
    kind: "number",
  },
  {
    id: "callerThrustSpecificFuelPerSecond",
    label: "Caller thrust specific fuel per second",
    kind: "number",
  },
  {
    id: "callerCruiseLiftDragRatio",
    label: "Caller cruise lift drag ratio",
    kind: "number",
  },
  {
    id: "initialAircraftMassKg",
    label: "Initial aircraft mass kg",
    kind: "number",
  },
  {
    id: "finalAircraftMassKg",
    label: "Final aircraft mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCruiseSpeedMSecond, "callerCruiseSpeedMSecond");
  positive(
    input.callerThrustSpecificFuelPerSecond,
    "callerThrustSpecificFuelPerSecond",
  );
  positive(input.callerCruiseLiftDragRatio, "callerCruiseLiftDragRatio");
  positive(input.initialAircraftMassKg, "initialAircraftMassKg");
  positive(input.finalAircraftMassKg, "finalAircraftMassKg");
  if (input.finalAircraftMassKg > input.initialAircraftMassKg)
    simpleError(
      "mass",
      "Breguet fuel-consumption branch requires final≤initial mass.",
    );
  return {
    jetBreguetRangeM:
      (input.callerCruiseSpeedMSecond /
        input.callerThrustSpecificFuelPerSecond) *
      input.callerCruiseLiftDragRatio *
      (Math.log(input.initialAircraftMassKg) -
        Math.log(input.finalAircraftMassKg)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCruiseSpeedMSecond: 100,
  callerThrustSpecificFuelPerSecond: 0.01,
  callerCruiseLiftDragRatio: 10,
  initialAircraftMassKg: 100,
  finalAircraftMassKg: 50,
} satisfies Input;
export const exampleOutput = {
  jetBreguetRangeM: 69314.71805599453,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/aircraft-range-breguet",
  title: "Breguet Range Calculator",
  description:
    "JET Breguet with thrust-specific weight fuel consumption/time convention, constant cruise parameters, not propeller version or reserves. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "jetBreguetRangeM", label: "Jet breguet range m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerCruiseSpeedMSecond: value.callerCruiseSpeedMSecond as number,
      callerThrustSpecificFuelPerSecond:
        value.callerThrustSpecificFuelPerSecond as number,
      callerCruiseLiftDragRatio: value.callerCruiseLiftDragRatio as number,
      initialAircraftMassKg: value.initialAircraftMassKg as number,
      finalAircraftMassKg: value.finalAircraftMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
