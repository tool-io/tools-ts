import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, curve } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMatchedOilTemperaturesKelvin: readonly number[];
  readonly observedMatchedOilViscositiesPaSeconds: readonly number[];
  readonly queryOilTemperatureKelvin: number;
}>;
export type Output = Readonly<{
  readonly interpolatedOilViscosityPaSeconds: number;
  readonly localObservedSecantSlope: number;
}>;
const inputFields = [
  {
    id: "observedMatchedOilTemperaturesKelvin",
    label: "Observed matched oil temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "observedMatchedOilViscositiesPaSeconds",
    label: "Observed matched oil viscosities pa seconds",
    kind: "numberList",
  },
  {
    id: "queryOilTemperatureKelvin",
    label: "Query oil temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedOilTemperaturesKelvin.forEach((v) =>
    positive(v, "observedMatchedOilTemperaturesKelvin"),
  );
  positive(input.queryOilTemperatureKelvin, "queryOilTemperatureKelvin");
  input.observedMatchedOilViscositiesPaSeconds.forEach((v) =>
    positive(v, "observedMatchedOilViscositiesPaSeconds"),
  );
  const v = curve(
    input.observedMatchedOilTemperaturesKelvin,
    input.observedMatchedOilViscositiesPaSeconds,
    input.queryOilTemperatureKelvin,
  );
  return {
    interpolatedOilViscosityPaSeconds: v.value,
    localObservedSecantSlope: v.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedOilTemperaturesKelvin: [1, 2, 3],
  observedMatchedOilViscositiesPaSeconds: [2, 4, 8],
  queryOilTemperatureKelvin: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedOilViscosityPaSeconds: 6,
  localObservedSecantSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/oil-viscosity",
  title: "Petroleum Oil Viscosity Calculator",
  description:
    "Read actual same-composition/pressure oil temperature/viscosity calibration, no invented compositional fluid constants or viscosity correlation. Piecewise linear measured calibration only; no extrapolation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedOilViscosityPaSeconds",
      label: "Interpolated oil viscosity pa seconds",
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
      observedMatchedOilTemperaturesKelvin:
        value.observedMatchedOilTemperaturesKelvin as readonly number[],
      observedMatchedOilViscositiesPaSeconds:
        value.observedMatchedOilViscositiesPaSeconds as readonly number[],
      queryOilTemperatureKelvin: value.queryOilTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
