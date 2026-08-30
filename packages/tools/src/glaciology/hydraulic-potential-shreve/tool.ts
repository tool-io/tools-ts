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
  readonly bedElevationsM: readonly number[];
  readonly iceThicknessesM: readonly number[];
  readonly waterPressureOverburdenFraction: number;
  readonly iceDensityKgPerM3: number;
  readonly waterDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly hydraulicPotentialsPa: readonly number[];
}>;
const inputFields = [
  { id: "bedElevationsM", label: "Bed elevations m", kind: "numberList" },
  { id: "iceThicknessesM", label: "Ice thicknesses m", kind: "numberList" },
  {
    id: "waterPressureOverburdenFraction",
    label: "Water pressure overburden fraction",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.iceThicknessesM.forEach((v) => nonnegative(v, "iceThicknessesM"));
  nonnegative(
    input.waterPressureOverburdenFraction,
    "waterPressureOverburdenFraction",
  );
  aligned(input.bedElevationsM, input.iceThicknessesM, "bedElevationsM");
  return {
    hydraulicPotentialsPa: input.bedElevationsM.map(
      (z, i) =>
        input.waterDensityKgPerM3 * input.gravityMPerSecondSquared * z +
        input.waterPressureOverburdenFraction *
          input.iceDensityKgPerM3 *
          input.gravityMPerSecondSquared *
          input.iceThicknessesM[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bedElevationsM: [0, 100],
  iceThicknessesM: [100, 200],
  waterPressureOverburdenFraction: 0.5,
  iceDensityKgPerM3: 900,
  waterDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  hydraulicPotentialsPa: [450000, 1900000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/hydraulic-potential-shreve",
  title: "Hydraulic Potential Shreve",
  description:
    "Evaluate Shreve hydraulic potential p_w+rho_w·g·bed elevation with caller water/overburden ratio; potentials share a vertical datum and no geodesy transform is performed.",
  inputs: inputFields,
  outputs: [
    {
      id: "hydraulicPotentialsPa",
      label: "Hydraulic potentials pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      bedElevationsM: value.bedElevationsM as readonly number[],
      iceThicknessesM: value.iceThicknessesM as readonly number[],
      waterPressureOverburdenFraction:
        value.waterPressureOverburdenFraction as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
