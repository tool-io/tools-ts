import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  potentialTemperature,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly practicalSalinity: number;
  readonly temperatureIpts68C: number;
  readonly pressureDbar: number;
  readonly referencePressureDbar: number;
}>;
export type Output = Readonly<{ readonly potentialTemperatureIpts68C: number }>;
const inputFields = [
  { id: "practicalSalinity", label: "Practical salinity", kind: "number" },
  { id: "temperatureIpts68C", label: "Temperature ipts68 c", kind: "number" },
  { id: "pressureDbar", label: "Pressure dbar", kind: "number" },
  {
    id: "referencePressureDbar",
    label: "Reference pressure dbar",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    potentialTemperatureIpts68C: potentialTemperature(
      input.practicalSalinity,
      input.temperatureIpts68C,
      input.pressureDbar,
      input.referencePressureDbar,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  practicalSalinity: 35,
  temperatureIpts68C: 10,
  pressureDbar: 1000,
  referencePressureDbar: 1000,
} satisfies Input;
export const exampleOutput = {
  potentialTemperatureIpts68C: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/potential-temperature-unesco-adiabatic",
  title: "Potential Temperature UNESCO Adiabatic Calculator",
  description:
    "UNESCO 1983 adiabatic gradient integrated RK4≤10dbar steps to explicit reference pressure, IPTS68 input/output; not conservative temperature. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "potentialTemperatureIpts68C",
      label: "Potential temperature ipts68 c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      practicalSalinity: value.practicalSalinity as number,
      temperatureIpts68C: value.temperatureIpts68C as number,
      pressureDbar: value.pressureDbar as number,
      referencePressureDbar: value.referencePressureDbar as number,
    }),
});
export const run = tool.execute;
export default tool;
