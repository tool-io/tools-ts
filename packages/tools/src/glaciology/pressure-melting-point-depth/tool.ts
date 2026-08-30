import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly iceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly clapeyronKelvinPerPa: number;
  readonly surfaceMeltingTemperatureC: number;
}>;
export type Output = Readonly<{
  readonly pressureMeltingTemperaturesC: readonly number[];
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "clapeyronKelvinPerPa",
    label: "Clapeyron kelvin per pa",
    kind: "number",
  },
  {
    id: "surfaceMeltingTemperatureC",
    label: "Surface melting temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  nonnegative(input.clapeyronKelvinPerPa, "clapeyronKelvinPerPa");
  if (!input.depthsM.length)
    simpleError("depthsM", "Nonempty depths required.");
  return {
    pressureMeltingTemperaturesC: input.depthsM.map(
      (z) =>
        input.surfaceMeltingTemperatureC -
        input.clapeyronKelvinPerPa *
          input.iceDensityKgPerM3 *
          input.gravityMPerSecondSquared *
          z,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 100],
  iceDensityKgPerM3: 900,
  gravityMPerSecondSquared: 10,
  clapeyronKelvinPerPa: 1e-7,
  surfaceMeltingTemperatureC: 0,
} satisfies Input;
export const exampleOutput = {
  pressureMeltingTemperaturesC: [0, -0.09],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/pressure-melting-point-depth",
  title: "Pressure Melting Point Depth",
  description:
    "Compute linear pressure-melting depression from ice overburden with supplied Clapeyron slope; solute and gas effects are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "pressureMeltingTemperaturesC",
      label: "Pressure melting temperatures c",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      clapeyronKelvinPerPa: value.clapeyronKelvinPerPa as number,
      surfaceMeltingTemperatureC: value.surfaceMeltingTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
