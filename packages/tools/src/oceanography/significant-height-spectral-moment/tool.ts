import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly frequenciesHz: readonly number[];
  readonly elevationSpectralDensitiesM2PerHz: readonly number[];
}>;
export type Output = Readonly<{
  readonly zerothMomentM2: number;
  readonly secondMomentM2Hz2: number;
  readonly significantWaveHeightM: number;
  readonly zeroCrossingPeriodSeconds: number;
}>;
const inputFields = [
  { id: "frequenciesHz", label: "Frequencies hz", kind: "numberList" },
  {
    id: "elevationSpectralDensitiesM2PerHz",
    label: "Elevation spectral densities m2 per hz",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.frequenciesHz.forEach((v) => positive(v, "frequenciesHz"));
  input.elevationSpectralDensitiesM2PerHz.forEach((v) =>
    nonnegative(v, "elevationSpectralDensitiesM2PerHz"),
  );
  const m0 = positive(
      integral(input.frequenciesHz, input.elevationSpectralDensitiesM2PerHz),
      "spectrum",
    ),
    m2 = positive(
      integral(
        input.frequenciesHz,
        input.elevationSpectralDensitiesM2PerHz.map(
          (v, i) => v * input.frequenciesHz[i] ** 2,
        ),
      ),
      "spectrum",
    );
  return {
    zerothMomentM2: m0,
    secondMomentM2Hz2: m2,
    significantWaveHeightM: 4 * Math.sqrt(m0),
    zeroCrossingPeriodSeconds: Math.sqrt(m0 / m2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frequenciesHz: [0.1, 0.2, 0.3],
  elevationSpectralDensitiesM2PerHz: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  zerothMomentM2: 0.2,
  secondMomentM2Hz2: 0.009,
  significantWaveHeightM: 1.7888543819998317,
  zeroCrossingPeriodSeconds: 4.714045207910317,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/significant-height-spectral-moment",
  title: "Significant Height Spectral Moment",
  description:
    "Integrate a supplied one-sided elevation PSD by trapezoidal spectral moments, returning Hm0 and Tm02; missing frequency bands are not extrapolated and buoy-heave aliases excluded.",
  inputs: inputFields,
  outputs: [
    { id: "zerothMomentM2", label: "Zeroth moment m2", kind: "number" },
    { id: "secondMomentM2Hz2", label: "Second moment m2 hz2", kind: "number" },
    {
      id: "significantWaveHeightM",
      label: "Significant wave height m",
      kind: "number",
    },
    {
      id: "zeroCrossingPeriodSeconds",
      label: "Zero crossing period seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      frequenciesHz: value.frequenciesHz as readonly number[],
      elevationSpectralDensitiesM2PerHz:
        value.elevationSpectralDensitiesM2PerHz as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
