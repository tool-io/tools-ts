import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, curve } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMatchedGasTemperaturesKelvin: readonly number[];
  readonly observedMatchedGasViscositiesPaSeconds: readonly number[];
  readonly queryGasTemperatureKelvin: number;
}>;
export type Output = Readonly<{
  readonly interpolatedGasViscosityPaSeconds: number;
  readonly localObservedSecantSlope: number;
}>;
const inputFields = [
  {
    id: "observedMatchedGasTemperaturesKelvin",
    label: "Observed matched gas temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "observedMatchedGasViscositiesPaSeconds",
    label: "Observed matched gas viscosities pa seconds",
    kind: "numberList",
  },
  {
    id: "queryGasTemperatureKelvin",
    label: "Query gas temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedGasTemperaturesKelvin.forEach((v) =>
    positive(v, "observedMatchedGasTemperaturesKelvin"),
  );
  positive(input.queryGasTemperatureKelvin, "queryGasTemperatureKelvin");
  input.observedMatchedGasViscositiesPaSeconds.forEach((v) =>
    positive(v, "observedMatchedGasViscositiesPaSeconds"),
  );
  const v = curve(
    input.observedMatchedGasTemperaturesKelvin,
    input.observedMatchedGasViscositiesPaSeconds,
    input.queryGasTemperatureKelvin,
  );
  return {
    interpolatedGasViscosityPaSeconds: v.value,
    localObservedSecantSlope: v.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedGasTemperaturesKelvin: [1, 2, 3],
  observedMatchedGasViscositiesPaSeconds: [2, 4, 8],
  queryGasTemperatureKelvin: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedGasViscosityPaSeconds: 6,
  localObservedSecantSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/gas-viscosity",
  title: "Petroleum Gas Viscosity Calculator",
  description:
    "Read actual same-composition/pressure gas temperature/viscosity calibration, no invented compositional fluid constants or viscosity correlation. Piecewise linear measured calibration only; no extrapolation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedGasViscosityPaSeconds",
      label: "Interpolated gas viscosity pa seconds",
      kind: "number",
    },
    {
      id: "localObservedSecantSlope",
      label: "Local observed secant slope",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMatchedGasTemperaturesKelvin:
        value.observedMatchedGasTemperaturesKelvin as readonly number[],
      observedMatchedGasViscositiesPaSeconds:
        value.observedMatchedGasViscositiesPaSeconds as readonly number[],
      queryGasTemperatureKelvin: value.queryGasTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
