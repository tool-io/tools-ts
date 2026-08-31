import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedWaterPressuresPa: readonly number[];
  readonly iceThicknessesM: readonly number[];
  readonly iceDensityKgM3: number;
  readonly gravityMSecond2: number;
}>;
export type Output = Readonly<{
  readonly waterToOverburdenPressureRatios: readonly number[];
  readonly aboveOverburdenObservationIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWaterPressuresPa",
    label: "Observed water pressures pa",
    kind: "numberList",
  },
  { id: "iceThicknessesM", label: "Ice thicknesses m", kind: "numberList" },
  { id: "iceDensityKgM3", label: "Ice density kg m3", kind: "number" },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.iceThicknessesM.forEach((v) => positive(v, "iceThicknessesM"));
  positive(input.iceDensityKgM3, "iceDensityKgM3");
  positive(input.gravityMSecond2, "gravityMSecond2");
  input.observedWaterPressuresPa.forEach((v) =>
    nonnegative(v, "observedWaterPressuresPa"),
  );
  aligned(
    input.observedWaterPressuresPa,
    input.iceThicknessesM,
    "observedWaterPressuresPa",
  );
  const ratios = input.observedWaterPressuresPa.map(
    (p, i) =>
      p /
      positive(
        input.iceDensityKgM3 * input.gravityMSecond2 * input.iceThicknessesM[i],
        "overburden",
      ),
  );
  return {
    waterToOverburdenPressureRatios: ratios,
    aboveOverburdenObservationIndices: ratios.flatMap((v, i) =>
      v > 1 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWaterPressuresPa: [0, 2000],
  iceThicknessesM: [1, 1],
  iceDensityKgM3: 1000,
  gravityMSecond2: 1,
} satisfies Input;
export const exampleOutput = {
  waterToOverburdenPressureRatios: [0, 2],
  aboveOverburdenObservationIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/subglacial-water-pressure-ratio",
  title: "Subglacial Water Pressure Ratio Calculator",
  description:
    "Audit observed pressure fractions of ice overburden without clamping superflotation evidence; distinct from signed effective-pressure subtraction and not hydraulic contact stability.",
  inputs: inputFields,
  outputs: [
    {
      id: "waterToOverburdenPressureRatios",
      label: "Water to overburden pressure ratios",
      kind: "numberList",
    },
    {
      id: "aboveOverburdenObservationIndices",
      label: "Above overburden observation indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWaterPressuresPa:
        value.observedWaterPressuresPa as readonly number[],
      iceThicknessesM: value.iceThicknessesM as readonly number[],
      iceDensityKgM3: value.iceDensityKgM3 as number,
      gravityMSecond2: value.gravityMSecond2 as number,
    }),
});
export const run = tool.execute;
export default tool;
