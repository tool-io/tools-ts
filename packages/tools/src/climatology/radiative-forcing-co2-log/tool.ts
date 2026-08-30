import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";

export type Input = Readonly<{
  readonly initialCo2ConcentrationPpm: number;
  readonly changedCo2ConcentrationPpm: number;
  readonly callerLogForcingCoefficientWPerM2: number;
}>;
export type Output = Readonly<{
  readonly calibratedCo2ForcingChangeWPerM2: number;
}>;
const inputFields = [
  {
    id: "initialCo2ConcentrationPpm",
    label: "Initial co2 concentration ppm",
    kind: "number",
  },
  {
    id: "changedCo2ConcentrationPpm",
    label: "Changed co2 concentration ppm",
    kind: "number",
  },
  {
    id: "callerLogForcingCoefficientWPerM2",
    label: "Caller log forcing coefficient w per m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialCo2ConcentrationPpm, "initialCo2ConcentrationPpm");
  positive(input.changedCo2ConcentrationPpm, "changedCo2ConcentrationPpm");
  positive(
    input.callerLogForcingCoefficientWPerM2,
    "callerLogForcingCoefficientWPerM2",
  );
  return {
    calibratedCo2ForcingChangeWPerM2:
      input.callerLogForcingCoefficientWPerM2 *
      (Math.log(input.changedCo2ConcentrationPpm) -
        Math.log(input.initialCo2ConcentrationPpm)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialCo2ConcentrationPpm: 280,
  changedCo2ConcentrationPpm: 560,
  callerLogForcingCoefficientWPerM2: 5.35,
} satisfies Input;
export const exampleOutput = {
  calibratedCo2ForcingChangeWPerM2: 3.708337415995707,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/radiative-forcing-co2-log",
  title: "Radiative Forcing CO2 Logarithm",
  description:
    "Calculate signed logarithmic CO2 radiative forcing change using caller concentration convention/coefficient; no warming, verified forcing or neglected gas/aerosol response is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedCo2ForcingChangeWPerM2",
      label: "Calibrated co2 forcing change w per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialCo2ConcentrationPpm: value.initialCo2ConcentrationPpm as number,
      changedCo2ConcentrationPpm: value.changedCo2ConcentrationPpm as number,
      callerLogForcingCoefficientWPerM2:
        value.callerLogForcingCoefficientWPerM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
