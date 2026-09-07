import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedThermalKelvin: readonly number[];
  readonly observedActivatedRatePerSecond: readonly number[];
  readonly callerBoltzmannEvKelvin: number;
}>;
export type Output = Readonly<{
  readonly fittedActivationEnergyEv: number;
  readonly fittedLogRatePrefactor: number;
  readonly arrheniusRSquared: number;
}>;
const inputFields = [
  {
    id: "observedThermalKelvin",
    label: "Observed thermal kelvin",
    kind: "numberList",
  },
  {
    id: "observedActivatedRatePerSecond",
    label: "Observed activated rate per second",
    kind: "numberList",
  },
  {
    id: "callerBoltzmannEvKelvin",
    label: "Caller boltzmann ev kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedThermalKelvin.forEach((v) =>
    positive(v, "observedThermalKelvin"),
  );
  input.observedActivatedRatePerSecond.forEach((v) =>
    positive(v, "observedActivatedRatePerSecond"),
  );
  positive(input.callerBoltzmannEvKelvin, "callerBoltzmannEvKelvin");
  aligned(
    input.observedThermalKelvin,
    input.observedActivatedRatePerSecond,
    "observedThermalKelvin",
  );
  const fit = linearFit(
    input.observedThermalKelvin.map((v) => 1 / v),
    input.observedActivatedRatePerSecond.map(Math.log),
  );
  return {
    fittedActivationEnergyEv: -fit.slope * input.callerBoltzmannEvKelvin,
    fittedLogRatePrefactor: fit.intercept,
    arrheniusRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedThermalKelvin: [300, 600],
  observedActivatedRatePerSecond: [1, 10],
  callerBoltzmannEvKelvin: 8.617333262145e-5,
} satisfies Input;
export const exampleOutput = {
  fittedActivationEnergyEv: 0.11905285866466098,
  fittedLogRatePrefactor: 4.605170185988092,
  arrheniusRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/activation-energy-level",
  title: "Semiconductor Activation Energy Level Calculator",
  description:
    "Extract signed activation energy and fit diagnostics from actual temperature/rate observations on caller assumed Arrhenius branch; not a forward material diffusivity model or process instruction.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedActivationEnergyEv",
      label: "Fitted activation energy ev",
      kind: "number",
    },
    {
      id: "fittedLogRatePrefactor",
      label: "Fitted log rate prefactor",
      kind: "number",
    },
    { id: "arrheniusRSquared", label: "Arrhenius r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedThermalKelvin: value.observedThermalKelvin as readonly number[],
      observedActivatedRatePerSecond:
        value.observedActivatedRatePerSecond as readonly number[],
      callerBoltzmannEvKelvin: value.callerBoltzmannEvKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
