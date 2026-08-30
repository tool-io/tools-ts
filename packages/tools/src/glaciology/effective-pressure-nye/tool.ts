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
  readonly iceThicknessesM: readonly number[];
  readonly waterPressuresPa: readonly number[];
  readonly iceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly overburdenPressuresPa: readonly number[];
  readonly effectivePressuresPa: readonly number[];
  readonly aboveFlotationFlags: readonly number[];
}>;
const inputFields = [
  { id: "iceThicknessesM", label: "Ice thicknesses m", kind: "numberList" },
  { id: "waterPressuresPa", label: "Water pressures pa", kind: "numberList" },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.iceThicknessesM.forEach((v) => nonnegative(v, "iceThicknessesM"));
  input.waterPressuresPa.forEach((v) => nonnegative(v, "waterPressuresPa"));
  aligned(input.iceThicknessesM, input.waterPressuresPa, "iceThicknessesM");
  const overburdenPressuresPa = input.iceThicknessesM.map(
      (h) => h * input.iceDensityKgPerM3 * input.gravityMPerSecondSquared,
    ),
    effectivePressuresPa = overburdenPressuresPa.map(
      (p, i) => p - input.waterPressuresPa[i],
    );
  return {
    overburdenPressuresPa,
    effectivePressuresPa,
    aboveFlotationFlags: effectivePressuresPa.map((v) => (v < 0 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  iceThicknessesM: [100, 100],
  waterPressuresPa: [800000, 1000000],
  iceDensityKgPerM3: 900,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  overburdenPressuresPa: [900000, 900000],
  effectivePressuresPa: [100000, -100000],
  aboveFlotationFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/effective-pressure-nye",
  title: "Effective Pressure Nye",
  description:
    "Calculate signed ice-overburden minus subglacial water pressure and flag pressure above overburden; negative effective pressure is not clamped or interpreted as stable contact.",
  inputs: inputFields,
  outputs: [
    {
      id: "overburdenPressuresPa",
      label: "Overburden pressures pa",
      kind: "numberList",
    },
    {
      id: "effectivePressuresPa",
      label: "Effective pressures pa",
      kind: "numberList",
    },
    {
      id: "aboveFlotationFlags",
      label: "Above flotation flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      iceThicknessesM: value.iceThicknessesM as readonly number[],
      waterPressuresPa: value.waterPressuresPa as readonly number[],
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
