import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSicTemperaturesKelvin: readonly number[];
  readonly observedMatchedSicGapEv: readonly number[];
  readonly querySicTemperatureKelvin: number;
}>;
export type Output = Readonly<{
  readonly interpolatedSicGapEv: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedSicTemperaturesKelvin",
    label: "Observed sic temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "observedMatchedSicGapEv",
    label: "Observed matched sic gap ev",
    kind: "numberList",
  },
  {
    id: "querySicTemperatureKelvin",
    label: "Query sic temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedSicGapEv.forEach((v) =>
    positive(v, "observedMatchedSicGapEv"),
  );
  input.observedSicTemperaturesKelvin.forEach((v) =>
    nonnegative(v, "observedSicTemperaturesKelvin"),
  );
  nonnegative(input.querySicTemperatureKelvin, "querySicTemperatureKelvin");
  const result = curve(
    input.observedSicTemperaturesKelvin,
    input.observedMatchedSicGapEv,
    input.querySicTemperatureKelvin,
  );
  return {
    interpolatedSicGapEv: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSicTemperaturesKelvin: [1, 2, 3],
  observedMatchedSicGapEv: [2, 4, 8],
  querySicTemperatureKelvin: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedSicGapEv: 6,
  localMeasuredResponseDerivative: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/sic-bandgap-vs-temperature",
  title: "Semiconductor Sic Bandgap Vs Temperature Calculator",
  description:
    "Read actual SiC-polytype-matched gap-temperature data with local derivative, not generic Varshni extrapolation. Independently matched measured piecewise-linear curve only, local slope retained; no extrapolation, invented material constants, process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedSicGapEv",
      label: "Interpolated sic gap ev",
      kind: "number",
    },
    {
      id: "localMeasuredResponseDerivative",
      label: "Local measured response derivative",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSicTemperaturesKelvin:
        value.observedSicTemperaturesKelvin as readonly number[],
      observedMatchedSicGapEv:
        value.observedMatchedSicGapEv as readonly number[],
      querySicTemperatureKelvin: value.querySicTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
