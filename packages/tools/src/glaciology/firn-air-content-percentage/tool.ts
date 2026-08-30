import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly layerThicknessesM: readonly number[];
  readonly layerDensitiesKgPerM3: readonly number[];
  readonly iceDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly firnAirEquivalentThicknessM: number;
  readonly columnAirVolumePercent: number;
}>;
const inputFields = [
  { id: "layerThicknessesM", label: "Layer thicknesses m", kind: "numberList" },
  {
    id: "layerDensitiesKgPerM3",
    label: "Layer densities kg per m3",
    kind: "numberList",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.layerThicknessesM.forEach((v) => positive(v, "layerThicknessesM"));
  input.layerDensitiesKgPerM3.forEach((v) =>
    positive(v, "layerDensitiesKgPerM3"),
  );
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  aligned(
    input.layerThicknessesM,
    input.layerDensitiesKgPerM3,
    "layerThicknessesM",
  );
  const firnAirEquivalentThicknessM = input.layerThicknessesM.reduce(
    (s, v, i) =>
      s +
      v *
        (1 -
          fraction(
            input.layerDensitiesKgPerM3[i] / input.iceDensityKgPerM3,
            "layerDensitiesKgPerM3",
          )),
    0,
  );
  return {
    firnAirEquivalentThicknessM,
    columnAirVolumePercent:
      (100 * firnAirEquivalentThicknessM) /
      input.layerThicknessesM.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerThicknessesM: [10, 20],
  layerDensitiesKgPerM3: [450, 900],
  iceDensityKgPerM3: 900,
} satisfies Input;
export const exampleOutput = {
  firnAirEquivalentThicknessM: 5,
  columnAirVolumePercent: 16.666666666666668,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/firn-air-content-percentage",
  title: "Firn Air Content Percentage",
  description:
    "Integrate air volume fraction 1−rho/rho_ice through layered firn; assumes pore space is air and excludes liquid water and pressure-compressed gas.",
  inputs: inputFields,
  outputs: [
    {
      id: "firnAirEquivalentThicknessM",
      label: "Firn air equivalent thickness m",
      kind: "number",
    },
    {
      id: "columnAirVolumePercent",
      label: "Column air volume percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerThicknessesM: value.layerThicknessesM as readonly number[],
      layerDensitiesKgPerM3: value.layerDensitiesKgPerM3 as readonly number[],
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
