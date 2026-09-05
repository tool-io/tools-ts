import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedColumnMm: number;
  readonly observedTemperatureC: number;
  readonly callerReferenceTemperatureC: number;
  readonly callerMercuryExpansionPerC: number;
  readonly callerScaleExpansionPerC: number;
}>;
export type Output = Readonly<{ readonly temperatureReducedColumnMm: number }>;
const inputFields = [
  { id: "observedColumnMm", label: "Observed column mm", kind: "number" },
  {
    id: "observedTemperatureC",
    label: "Observed temperature c",
    kind: "number",
  },
  {
    id: "callerReferenceTemperatureC",
    label: "Caller reference temperature c",
    kind: "number",
  },
  {
    id: "callerMercuryExpansionPerC",
    label: "Caller mercury expansion per c",
    kind: "number",
  },
  {
    id: "callerScaleExpansionPerC",
    label: "Caller scale expansion per c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedColumnMm, "observedColumnMm");
  nonnegative(input.callerMercuryExpansionPerC, "callerMercuryExpansionPerC");
  nonnegative(input.callerScaleExpansionPerC, "callerScaleExpansionPerC");
  const dt = input.observedTemperatureC - input.callerReferenceTemperatureC;
  return {
    temperatureReducedColumnMm:
      (input.observedColumnMm *
        positive(1 + input.callerScaleExpansionPerC * dt, "scale factor")) /
      positive(1 + input.callerMercuryExpansionPerC * dt, "mercury factor"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedColumnMm: 100,
  observedTemperatureC: 20,
  callerReferenceTemperatureC: 0,
  callerMercuryExpansionPerC: 0.0002,
  callerScaleExpansionPerC: 1e-5,
} satisfies Input;
export const exampleOutput = {
  temperatureReducedColumnMm: 99.6215139442231,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/mercurial-barometer-temperature-correction",
  title: "Mercurial Barometer Temperature Correction Calculator",
  description:
    "Mercury-barometer column reduction using independent mercury and scale expansion coefficients, same reference temperature; gravity/index corrections not included. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "temperatureReducedColumnMm",
      label: "Temperature reduced column mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedColumnMm: value.observedColumnMm as number,
      observedTemperatureC: value.observedTemperatureC as number,
      callerReferenceTemperatureC: value.callerReferenceTemperatureC as number,
      callerMercuryExpansionPerC: value.callerMercuryExpansionPerC as number,
      callerScaleExpansionPerC: value.callerScaleExpansionPerC as number,
    }),
});
export const run = tool.execute;
export default tool;
