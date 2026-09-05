import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedAirTemperatureK: number;
  readonly independentlyCalibratedAtmosphericEmissivity: number;
  readonly callerStefanBoltzmannWM2K4: number;
}>;
export type Output = Readonly<{
  readonly conditionalClearSkyDownwellingWM2: number;
}>;
const inputFields = [
  {
    id: "observedAirTemperatureK",
    label: "Observed air temperature k",
    kind: "number",
  },
  {
    id: "independentlyCalibratedAtmosphericEmissivity",
    label: "Independently calibrated atmospheric emissivity",
    kind: "number",
  },
  {
    id: "callerStefanBoltzmannWM2K4",
    label: "Caller stefan boltzmann w m2 k4",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedAirTemperatureK, "observedAirTemperatureK");
  positive(input.callerStefanBoltzmannWM2K4, "callerStefanBoltzmannWM2K4");
  fraction(
    input.independentlyCalibratedAtmosphericEmissivity,
    "independentlyCalibratedAtmosphericEmissivity",
  );
  return {
    conditionalClearSkyDownwellingWM2:
      input.independentlyCalibratedAtmosphericEmissivity *
      input.callerStefanBoltzmannWM2K4 *
      input.observedAirTemperatureK ** 4,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAirTemperatureK: 300,
  independentlyCalibratedAtmosphericEmissivity: 0.8,
  callerStefanBoltzmannWM2K4: 5.670374419e-8,
} satisfies Input;
export const exampleOutput = {
  conditionalClearSkyDownwellingWM2: 367.44026235120003,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/downwelling-longwave-clear-sky-parametrization",
  title: "Downwelling Longwave Clear Sky Parametrization Calculator",
  description:
    "Clear-sky calibrated emissivityσT⁴ downwelling model; caller independent same-band humidity calibration, not surface emitted flux or universal emissivity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalClearSkyDownwellingWM2",
      label: "Conditional clear sky downwelling w m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAirTemperatureK: value.observedAirTemperatureK as number,
      independentlyCalibratedAtmosphericEmissivity:
        value.independentlyCalibratedAtmosphericEmissivity as number,
      callerStefanBoltzmannWM2K4: value.callerStefanBoltzmannWM2K4 as number,
    }),
});
export const run = tool.execute;
export default tool;
