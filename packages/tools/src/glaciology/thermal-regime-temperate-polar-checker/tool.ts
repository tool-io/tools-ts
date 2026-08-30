import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly iceTemperaturesC: readonly number[];
  readonly iceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly clapeyronKelvinPerPa: number;
  readonly comparisonToleranceC: number;
}>;
export type Output = Readonly<{
  readonly pressureMeltingTemperaturesC: readonly number[];
  readonly coldFlags: readonly number[];
  readonly nearMeltingFlags: readonly number[];
  readonly aboveModelMeltingFlags: readonly number[];
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "iceTemperaturesC", label: "Ice temperatures c", kind: "numberList" },
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
    id: "comparisonToleranceC",
    label: "Comparison tolerance c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  nonnegative(input.clapeyronKelvinPerPa, "clapeyronKelvinPerPa");
  nonnegative(input.comparisonToleranceC, "comparisonToleranceC");
  aligned(input.depthsM, input.iceTemperaturesC, "depthsM");
  const pressureMeltingTemperaturesC = input.depthsM.map(
      (z) =>
        -z *
        input.iceDensityKgPerM3 *
        input.gravityMPerSecondSquared *
        input.clapeyronKelvinPerPa,
    ),
    offsets = input.iceTemperaturesC.map(
      (v, i) => v - pressureMeltingTemperaturesC[i],
    );
  return {
    pressureMeltingTemperaturesC,
    coldFlags: offsets.map((v) => (v < -input.comparisonToleranceC ? 1 : 0)),
    nearMeltingFlags: offsets.map((v) =>
      Math.abs(v) <= input.comparisonToleranceC ? 1 : 0,
    ),
    aboveModelMeltingFlags: offsets.map((v) =>
      v > input.comparisonToleranceC ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 100],
  iceTemperaturesC: [-10, -0.09],
  iceDensityKgPerM3: 900,
  gravityMPerSecondSquared: 10,
  clapeyronKelvinPerPa: 1e-7,
  comparisonToleranceC: 0.01,
} satisfies Input;
export const exampleOutput = {
  pressureMeltingTemperaturesC: [0, -0.09],
  coldFlags: [1, 0],
  nearMeltingFlags: [0, 1],
  aboveModelMeltingFlags: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/thermal-regime-temperate-polar-checker",
  title: "Thermal Regime Temperate Polar Checker",
  description:
    "Screen measured depth temperatures against pressure melting with caller tolerance; near-melting ice may be temperate, but spatial coverage, impurities and water content are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "pressureMeltingTemperaturesC",
      label: "Pressure melting temperatures c",
      kind: "numberList",
    },
    { id: "coldFlags", label: "Cold flags", kind: "numberList" },
    { id: "nearMeltingFlags", label: "Near melting flags", kind: "numberList" },
    {
      id: "aboveModelMeltingFlags",
      label: "Above model melting flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      iceTemperaturesC: value.iceTemperaturesC as readonly number[],
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      clapeyronKelvinPerPa: value.clapeyronKelvinPerPa as number,
      comparisonToleranceC: value.comparisonToleranceC as number,
    }),
});
export const run = tool.execute;
export default tool;
