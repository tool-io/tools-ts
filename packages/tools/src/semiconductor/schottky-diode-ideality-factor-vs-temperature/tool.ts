import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTemperaturesKelvin: readonly number[];
  readonly observedLocalVoltageSlopePerLogCurrentV: readonly number[];
  readonly callerBoltzmannEvKelvin: number;
}>;
export type Output = Readonly<{
  readonly observedIdealityFactorsByTemperature: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTemperaturesKelvin",
    label: "Observed temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "observedLocalVoltageSlopePerLogCurrentV",
    label: "Observed local voltage slope per log current v",
    kind: "numberList",
  },
  {
    id: "callerBoltzmannEvKelvin",
    label: "Caller boltzmann ev kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTemperaturesKelvin.forEach((v) =>
    positive(v, "observedTemperaturesKelvin"),
  );
  input.observedLocalVoltageSlopePerLogCurrentV.forEach((v) =>
    positive(v, "observedLocalVoltageSlopePerLogCurrentV"),
  );
  positive(input.callerBoltzmannEvKelvin, "callerBoltzmannEvKelvin");
  aligned(
    input.observedTemperaturesKelvin,
    input.observedLocalVoltageSlopePerLogCurrentV,
    "observedTemperaturesKelvin",
  );
  return {
    observedIdealityFactorsByTemperature: input.observedTemperaturesKelvin.map(
      (v, i) =>
        input.observedLocalVoltageSlopePerLogCurrentV[i] /
        (input.callerBoltzmannEvKelvin * v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTemperaturesKelvin: [300, 400],
  observedLocalVoltageSlopePerLogCurrentV: [0.06, 0.08],
  callerBoltzmannEvKelvin: 0.0001,
} satisfies Input;
export const exampleOutput = {
  observedIdealityFactorsByTemperature: [2, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/schottky-diode-ideality-factor-vs-temperature",
  title:
    "Semiconductor Schottky Diode Ideality Factor Vs Temperature Calculator",
  description:
    "Audit independently fitted local dV/dlnI at actual multiple temperatures, no paired two-forward-point extrapolation or universal ideality versus T.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIdealityFactorsByTemperature",
      label: "Observed ideality factors by temperature",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTemperaturesKelvin:
        value.observedTemperaturesKelvin as readonly number[],
      observedLocalVoltageSlopePerLogCurrentV:
        value.observedLocalVoltageSlopePerLogCurrentV as readonly number[],
      callerBoltzmannEvKelvin: value.callerBoltzmannEvKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
