import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly co2MassConcentrationMgPerM3: number;
  readonly so2MassConcentrationMgPerM3: number;
  readonly co2MolarMassGramsPerMol: number;
  readonly so2MolarMassGramsPerMol: number;
  readonly co2BlankMgPerM3: number;
  readonly so2BlankMgPerM3: number;
}>;
export type Output = Readonly<{
  readonly blankCorrectedCo2ToSo2MolarRatio: number;
  readonly co2AboveBlank: boolean;
}>;
const inputFields = [
  {
    id: "co2MassConcentrationMgPerM3",
    label: "Co2 mass concentration mg per m3",
    kind: "number",
  },
  {
    id: "so2MassConcentrationMgPerM3",
    label: "So2 mass concentration mg per m3",
    kind: "number",
  },
  {
    id: "co2MolarMassGramsPerMol",
    label: "Co2 molar mass grams per mol",
    kind: "number",
  },
  {
    id: "so2MolarMassGramsPerMol",
    label: "So2 molar mass grams per mol",
    kind: "number",
  },
  { id: "co2BlankMgPerM3", label: "Co2 blank mg per m3", kind: "number" },
  { id: "so2BlankMgPerM3", label: "So2 blank mg per m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.co2MolarMassGramsPerMol, "co2MolarMassGramsPerMol");
  positive(input.so2MolarMassGramsPerMol, "so2MolarMassGramsPerMol");
  nonnegative(input.co2MassConcentrationMgPerM3, "co2MassConcentrationMgPerM3");
  nonnegative(input.so2MassConcentrationMgPerM3, "so2MassConcentrationMgPerM3");
  nonnegative(input.co2BlankMgPerM3, "co2BlankMgPerM3");
  nonnegative(input.so2BlankMgPerM3, "so2BlankMgPerM3");
  const c = input.co2MassConcentrationMgPerM3 - input.co2BlankMgPerM3,
    s = positive(
      input.so2MassConcentrationMgPerM3 - input.so2BlankMgPerM3,
      "so2BlankMgPerM3",
    );
  return {
    blankCorrectedCo2ToSo2MolarRatio:
      ((c / s) * input.so2MolarMassGramsPerMol) / input.co2MolarMassGramsPerMol,
    co2AboveBlank: c > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  co2MassConcentrationMgPerM3: 44,
  so2MassConcentrationMgPerM3: 64,
  co2MolarMassGramsPerMol: 44,
  so2MolarMassGramsPerMol: 64,
  co2BlankMgPerM3: 0,
  so2BlankMgPerM3: 0,
} satisfies Input;
export const exampleOutput = {
  blankCorrectedCo2ToSo2MolarRatio: 1,
  co2AboveBlank: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/co2-so2-molar-ratio-volcanic",
  title: "CO2 SO2 Molar Ratio Volcanic",
  description:
    "Convert paired mass concentrations to a blank-corrected volcanic CO2/SO2 molar ratio on the same gas basis; signed CO2 nondetections remain explicit and a nonpositive SO2 denominator is not assigned a ratio.",
  inputs: inputFields,
  outputs: [
    {
      id: "blankCorrectedCo2ToSo2MolarRatio",
      label: "Blank corrected co2 to so2 molar ratio",
      kind: "number",
    },
    { id: "co2AboveBlank", label: "Co2 above blank", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      co2MassConcentrationMgPerM3: value.co2MassConcentrationMgPerM3 as number,
      so2MassConcentrationMgPerM3: value.so2MassConcentrationMgPerM3 as number,
      co2MolarMassGramsPerMol: value.co2MolarMassGramsPerMol as number,
      so2MolarMassGramsPerMol: value.so2MolarMassGramsPerMol as number,
      co2BlankMgPerM3: value.co2BlankMgPerM3 as number,
      so2BlankMgPerM3: value.so2BlankMgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
