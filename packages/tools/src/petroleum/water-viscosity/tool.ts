import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, curve } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMatchedWaterTemperaturesKelvin: readonly number[];
  readonly observedMatchedWaterViscositiesPaSeconds: readonly number[];
  readonly queryWaterTemperatureKelvin: number;
}>;
export type Output = Readonly<{
  readonly interpolatedWaterViscosityPaSeconds: number;
  readonly localObservedSecantSlope: number;
}>;
const inputFields = [
  {
    id: "observedMatchedWaterTemperaturesKelvin",
    label: "Observed matched water temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "observedMatchedWaterViscositiesPaSeconds",
    label: "Observed matched water viscosities pa seconds",
    kind: "numberList",
  },
  {
    id: "queryWaterTemperatureKelvin",
    label: "Query water temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedWaterTemperaturesKelvin.forEach((v) =>
    positive(v, "observedMatchedWaterTemperaturesKelvin"),
  );
  positive(input.queryWaterTemperatureKelvin, "queryWaterTemperatureKelvin");
  input.observedMatchedWaterViscositiesPaSeconds.forEach((v) =>
    positive(v, "observedMatchedWaterViscositiesPaSeconds"),
  );
  const v = curve(
    input.observedMatchedWaterTemperaturesKelvin,
    input.observedMatchedWaterViscositiesPaSeconds,
    input.queryWaterTemperatureKelvin,
  );
  return {
    interpolatedWaterViscosityPaSeconds: v.value,
    localObservedSecantSlope: v.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedWaterTemperaturesKelvin: [1, 2, 3],
  observedMatchedWaterViscositiesPaSeconds: [2, 4, 8],
  queryWaterTemperatureKelvin: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedWaterViscosityPaSeconds: 6,
  localObservedSecantSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/water-viscosity",
  title: "Petroleum Water Viscosity Calculator",
  description:
    "Read actual same-composition/pressure water temperature/viscosity calibration, no invented compositional fluid constants or viscosity correlation. Piecewise linear measured calibration only; no extrapolation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedWaterViscosityPaSeconds",
      label: "Interpolated water viscosity pa seconds",
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
      observedMatchedWaterTemperaturesKelvin:
        value.observedMatchedWaterTemperaturesKelvin as readonly number[],
      observedMatchedWaterViscositiesPaSeconds:
        value.observedMatchedWaterViscositiesPaSeconds as readonly number[],
      queryWaterTemperatureKelvin: value.queryWaterTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
