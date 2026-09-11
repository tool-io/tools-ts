import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMassFlowKgPerSecond: number;
  readonly callerCpJoulesPerKgKelvin: number;
  readonly actualOutletTemperatureKelvin: number;
  readonly actualInletTemperatureKelvin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMassFlowKgPerSecond",
    label: "Actual mass flow kg per second",
    kind: "number",
  },
  {
    id: "callerCpJoulesPerKgKelvin",
    label: "Caller cp joules per kg kelvin",
    kind: "number",
  },
  {
    id: "actualOutletTemperatureKelvin",
    label: "Actual outlet temperature kelvin",
    kind: "number",
  },
  {
    id: "actualInletTemperatureKelvin",
    label: "Actual inlet temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualMassFlowKgPerSecond, "actualMassFlowKgPerSecond");
  positive(input.callerCpJoulesPerKgKelvin, "callerCpJoulesPerKgKelvin");
  positive(
    input.actualOutletTemperatureKelvin,
    "actualOutletTemperatureKelvin",
  );
  positive(input.actualInletTemperatureKelvin, "actualInletTemperatureKelvin");
  if (input.actualOutletTemperatureKelvin < input.actualInletTemperatureKelvin)
    simpleError("temperature", "Declared positive compression-rise branch.");
  return {
    value:
      input.actualMassFlowKgPerSecond *
      input.callerCpJoulesPerKgKelvin *
      (input.actualOutletTemperatureKelvin -
        input.actualInletTemperatureKelvin),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMassFlowKgPerSecond: 2,
    callerCpJoulesPerKgKelvin: 5,
    actualOutletTemperatureKelvin: 302,
    actualInletTemperatureKelvin: 300,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/compressor-power",
  title: "Compressor Power Calculator",
  description:
    "Actual steady adiabatic ideal-gas compressor enthalpy-rise shaft power at independently matched cp; heat/kinetic changes excluded, not choose outlet temperature or rating. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
