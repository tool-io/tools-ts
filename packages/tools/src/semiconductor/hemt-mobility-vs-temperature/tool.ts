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
  aligned,
  strictlyIncreasing,
  fitPower,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedHemtTemperaturesKelvin: readonly number[];
  readonly observedHemtMobilities: readonly number[];
  readonly queryTemperatureKelvin: number;
}>;
export type Output = Readonly<{
  readonly fittedTemperatureExponent: number;
  readonly modeledHemtMobility: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedHemtTemperaturesKelvin",
    label: "Observed hemt temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "observedHemtMobilities",
    label: "Observed hemt mobilities",
    kind: "numberList",
  },
  {
    id: "queryTemperatureKelvin",
    label: "Query temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedHemtTemperaturesKelvin.forEach((v) =>
    positive(v, "observedHemtTemperaturesKelvin"),
  );
  input.observedHemtMobilities.forEach((v) =>
    positive(v, "observedHemtMobilities"),
  );
  positive(input.queryTemperatureKelvin, "queryTemperatureKelvin");
  aligned(
    input.observedHemtTemperaturesKelvin,
    input.observedHemtMobilities,
    "fit",
  );
  strictlyIncreasing(input.observedHemtTemperaturesKelvin, "temperature");
  if (
    input.queryTemperatureKelvin < input.observedHemtTemperaturesKelvin[0] ||
    input.queryTemperatureKelvin > input.observedHemtTemperaturesKelvin.at(-1)!
  )
    simpleError("query", "No extrapolation beyond measured HEMT temperatures.");
  const fit = fitPower(
    input.observedHemtTemperaturesKelvin,
    input.observedHemtMobilities,
  );
  return {
    fittedTemperatureExponent: fit.exponent,
    modeledHemtMobility:
      fit.prefactor * input.queryTemperatureKelvin ** fit.exponent,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHemtTemperaturesKelvin: [100, 200],
  observedHemtMobilities: [4, 1],
  queryTemperatureKelvin: 150,
} satisfies Input;
export const exampleOutput = {
  fittedTemperatureExponent: -2,
  modeledHemtMobility: 1.7777777777777777,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/hemt-mobility-vs-temperature",
  title: "Semiconductor HEMT Mobility Vs Temperature Calculator",
  description:
    "Fit actual HEMT mobility-temperature power exponent from observations instead of existing fixed phonon/impurity power defaults, query only observed range.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedTemperatureExponent",
      label: "Fitted temperature exponent",
      kind: "number",
    },
    {
      id: "modeledHemtMobility",
      label: "Modeled hemt mobility",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedHemtTemperaturesKelvin:
        value.observedHemtTemperaturesKelvin as readonly number[],
      observedHemtMobilities: value.observedHemtMobilities as readonly number[],
      queryTemperatureKelvin: value.queryTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
