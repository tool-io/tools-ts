import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerBarrierMeanEv: number;
  readonly callerBarrierStdDevEv: number;
  readonly observedTemperatureKelvin: number;
  readonly callerBoltzmannEvKelvin: number;
}>;
export type Output = Readonly<{
  readonly modeledGaussianApparentBarrierEv: number;
}>;
const inputFields = [
  {
    id: "callerBarrierMeanEv",
    label: "Caller barrier mean ev",
    kind: "number",
  },
  {
    id: "callerBarrierStdDevEv",
    label: "Caller barrier std dev ev",
    kind: "number",
  },
  {
    id: "observedTemperatureKelvin",
    label: "Observed temperature kelvin",
    kind: "number",
  },
  {
    id: "callerBoltzmannEvKelvin",
    label: "Caller boltzmann ev kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedTemperatureKelvin, "observedTemperatureKelvin");
  positive(input.callerBoltzmannEvKelvin, "callerBoltzmannEvKelvin");
  nonnegative(input.callerBarrierStdDevEv, "callerBarrierStdDevEv");
  return {
    modeledGaussianApparentBarrierEv:
      input.callerBarrierMeanEv -
      input.callerBarrierStdDevEv ** 2 /
        (2 * input.callerBoltzmannEvKelvin * input.observedTemperatureKelvin),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBarrierMeanEv: 1,
  callerBarrierStdDevEv: 0.1,
  observedTemperatureKelvin: 300,
  callerBoltzmannEvKelvin: 0.0001,
} satisfies Input;
export const exampleOutput = {
  modeledGaussianApparentBarrierEv: 0.8333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/schottky-diode-barrier-height-inhomogeneity",
  title: "Semiconductor Schottky Diode Barrier Height Inhomogeneity Calculator",
  description:
    "Evaluate explicit Gaussian Schottky barrier-distribution apparent height mean−variance/(2kT); not ideal work-function/affinity subtraction or automatic barrier extraction.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledGaussianApparentBarrierEv",
      label: "Modeled gaussian apparent barrier ev",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBarrierMeanEv: value.callerBarrierMeanEv as number,
      callerBarrierStdDevEv: value.callerBarrierStdDevEv as number,
      observedTemperatureKelvin: value.observedTemperatureKelvin as number,
      callerBoltzmannEvKelvin: value.callerBoltzmannEvKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
