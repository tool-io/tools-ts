import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, norm } from "../shared.js";

export type Input = Readonly<{
  readonly pressureGradientPaPerM: readonly number[];
  readonly airDensityKgPerM3: number;
  readonly coriolisPerSecond: number;
}>;
export type Output = Readonly<{
  readonly geostrophicWindComponentsMPerSecond: readonly number[];
  readonly geostrophicWindSpeedMPerSecond: number;
}>;
const inputFields = [
  {
    id: "pressureGradientPaPerM",
    label: "Pressure gradient pa per m",
    kind: "numberList",
  },
  { id: "airDensityKgPerM3", label: "Air density kg per m3", kind: "number" },
  { id: "coriolisPerSecond", label: "Coriolis per second", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.airDensityKgPerM3, "airDensityKgPerM3");
  if (
    input.pressureGradientPaPerM.length !== 2 ||
    input.coriolisPerSecond === 0
  )
    simpleError(
      "gradient",
      "Two planar east/north gradients and nonzero Coriolis required.",
    );
  const [x, y] = input.pressureGradientPaPerM,
    d = input.airDensityKgPerM3 * input.coriolisPerSecond,
    geostrophicWindComponentsMPerSecond = [-y / d, x / d];
  return {
    geostrophicWindComponentsMPerSecond,
    geostrophicWindSpeedMPerSecond: norm(geostrophicWindComponentsMPerSecond),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pressureGradientPaPerM: [0.001, 0.002],
  airDensityKgPerM3: 1,
  coriolisPerSecond: 0.0001,
} satisfies Input;
export const exampleOutput = {
  geostrophicWindComponentsMPerSecond: [-20, 10],
  geostrophicWindSpeedMPerSecond: 22.360679774997898,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/geostrophic-wind-speed",
  title: "Geostrophic Wind Speed",
  description:
    "Compute signed east/north geostrophic vector under caller horizontal pressure gradients, density and Coriolis, not true terrain wind or a pressure-force magnitude alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "geostrophicWindComponentsMPerSecond",
      label: "Geostrophic wind components m per second",
      kind: "numberList",
    },
    {
      id: "geostrophicWindSpeedMPerSecond",
      label: "Geostrophic wind speed m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pressureGradientPaPerM: value.pressureGradientPaPerM as readonly number[],
      airDensityKgPerM3: value.airDensityKgPerM3 as number,
      coriolisPerSecond: value.coriolisPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
