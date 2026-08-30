import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  integral,
} from "../shared.js";

export type Input = Readonly<{
  readonly pressureLevelsPa: readonly number[];
  readonly specificWaterVaporMassFractions: readonly number[];
  readonly gravityMPerSecondSquared: number;
  readonly liquidWaterDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly observedColumnWaterVaporKgPerM2: number;
  readonly observedColumnPrecipitableWaterMm: number;
}>;
const inputFields = [
  { id: "pressureLevelsPa", label: "Pressure levels pa", kind: "numberList" },
  {
    id: "specificWaterVaporMassFractions",
    label: "Specific water vapor mass fractions",
    kind: "numberList",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "liquidWaterDensityKgPerM3",
    label: "Liquid water density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pressureLevelsPa.forEach((v) => positive(v, "pressureLevelsPa"));
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.liquidWaterDensityKgPerM3, "liquidWaterDensityKgPerM3");
  input.specificWaterVaporMassFractions.forEach((v) =>
    fraction(v, "specificWaterVaporMassFractions"),
  );
  const observedColumnWaterVaporKgPerM2 =
    integral(input.pressureLevelsPa, input.specificWaterVaporMassFractions) /
    input.gravityMPerSecondSquared;
  return {
    observedColumnWaterVaporKgPerM2,
    observedColumnPrecipitableWaterMm:
      (1000 * observedColumnWaterVaporKgPerM2) /
      input.liquidWaterDensityKgPerM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pressureLevelsPa: [50000, 100000],
  specificWaterVaporMassFractions: [0.01, 0.01],
  gravityMPerSecondSquared: 10,
  liquidWaterDensityKgPerM3: 1000,
} satisfies Input;
export const exampleOutput = {
  observedColumnWaterVaporKgPerM2: 50,
  observedColumnPrecipitableWaterMm: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/precipitable-water-column",
  title: "Precipitable Water Column",
  description:
    "Integrate supplied specific humidity over increasing pressure in measured column with gravity/liquid density conversion; partial observed column remains partial and condensate or unsampled atmosphere is not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedColumnWaterVaporKgPerM2",
      label: "Observed column water vapor kg per m2",
      kind: "number",
    },
    {
      id: "observedColumnPrecipitableWaterMm",
      label: "Observed column precipitable water mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pressureLevelsPa: value.pressureLevelsPa as readonly number[],
      specificWaterVaporMassFractions:
        value.specificWaterVaporMassFractions as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      liquidWaterDensityKgPerM3: value.liquidWaterDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
