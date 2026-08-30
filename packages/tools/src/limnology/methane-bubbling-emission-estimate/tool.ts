import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly trapGasVolumesLiters: readonly number[];
  readonly blankGasVolumesLiters: readonly number[];
  readonly methaneMoleFractions: readonly number[];
  readonly trapAreasM2: readonly number[];
  readonly deploymentDays: readonly number[];
  readonly gasPressurePa: number;
  readonly waterVaporPressurePa: number;
  readonly gasTemperatureKelvin: number;
  readonly gasConstantPaM3PerMoleK: number;
  readonly methaneMolarMassGramsPerMole: number;
}>;
export type Output = Readonly<{
  readonly blankCorrectedMethaneMoles: number;
  readonly methaneFluxGramsPerM2Day: number;
}>;
const inputFields = [
  {
    id: "trapGasVolumesLiters",
    label: "Trap gas volumes liters",
    kind: "numberList",
  },
  {
    id: "blankGasVolumesLiters",
    label: "Blank gas volumes liters",
    kind: "numberList",
  },
  {
    id: "methaneMoleFractions",
    label: "Methane mole fractions",
    kind: "numberList",
  },
  { id: "trapAreasM2", label: "Trap areas m2", kind: "numberList" },
  { id: "deploymentDays", label: "Deployment days", kind: "numberList" },
  { id: "gasPressurePa", label: "Gas pressure pa", kind: "number" },
  {
    id: "waterVaporPressurePa",
    label: "Water vapor pressure pa",
    kind: "number",
  },
  {
    id: "gasTemperatureKelvin",
    label: "Gas temperature kelvin",
    kind: "number",
  },
  {
    id: "gasConstantPaM3PerMoleK",
    label: "Gas constant pa m3 per mole k",
    kind: "number",
  },
  {
    id: "methaneMolarMassGramsPerMole",
    label: "Methane molar mass grams per mole",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.trapAreasM2.forEach((v) => positive(v, "trapAreasM2"));
  input.deploymentDays.forEach((v) => positive(v, "deploymentDays"));
  positive(input.gasPressurePa, "gasPressurePa");
  positive(input.gasTemperatureKelvin, "gasTemperatureKelvin");
  positive(input.gasConstantPaM3PerMoleK, "gasConstantPaM3PerMoleK");
  positive(input.methaneMolarMassGramsPerMole, "methaneMolarMassGramsPerMole");
  input.trapGasVolumesLiters.forEach((v) =>
    nonnegative(v, "trapGasVolumesLiters"),
  );
  input.blankGasVolumesLiters.forEach((v) =>
    nonnegative(v, "blankGasVolumesLiters"),
  );
  nonnegative(input.waterVaporPressurePa, "waterVaporPressurePa");
  input.methaneMoleFractions.forEach((v) =>
    fraction(v, "methaneMoleFractions"),
  );
  aligned(
    input.trapGasVolumesLiters,
    input.blankGasVolumesLiters,
    "trapGasVolumesLiters",
  );
  aligned(
    input.trapGasVolumesLiters,
    input.methaneMoleFractions,
    "trapGasVolumesLiters",
  );
  aligned(
    input.trapGasVolumesLiters,
    input.trapAreasM2,
    "trapGasVolumesLiters",
  );
  aligned(
    input.trapGasVolumesLiters,
    input.deploymentDays,
    "trapGasVolumesLiters",
  );
  const dryPressure = positive(
      input.gasPressurePa - input.waterVaporPressurePa,
      "waterVaporPressurePa",
    ),
    blankCorrectedMethaneMoles =
      (input.trapGasVolumesLiters.reduce(
        (s, v, i) =>
          s +
          ((v - input.blankGasVolumesLiters[i]) / 1000) *
            input.methaneMoleFractions[i],
        0,
      ) *
        dryPressure) /
      (input.gasConstantPaM3PerMoleK * input.gasTemperatureKelvin),
    exposure = input.trapAreasM2.reduce(
      (s, v, i) => s + v * input.deploymentDays[i],
      0,
    );
  return {
    blankCorrectedMethaneMoles,
    methaneFluxGramsPerM2Day:
      (blankCorrectedMethaneMoles * input.methaneMolarMassGramsPerMole) /
      exposure,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trapGasVolumesLiters: [2],
  blankGasVolumesLiters: [0.2],
  methaneMoleFractions: [0.5],
  trapAreasM2: [1],
  deploymentDays: [2],
  gasPressurePa: 100000,
  waterVaporPressurePa: 0,
  gasTemperatureKelvin: 300,
  gasConstantPaM3PerMoleK: 8.314,
  methaneMolarMassGramsPerMole: 16,
} satisfies Input;
export const exampleOutput = {
  blankCorrectedMethaneMoles: 0.036083714216983406,
  methaneFluxGramsPerM2Day: 0.28866971373586725,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/methane-bubbling-emission-estimate",
  title: "Methane Bubbling Emission Estimate",
  description:
    "Normalize trap-measured bubble methane by dry-gas ideal-law correction and summed area×time; negative blank-corrected estimates are preserved as nondetection evidence, not clamped emissions.",
  inputs: inputFields,
  outputs: [
    {
      id: "blankCorrectedMethaneMoles",
      label: "Blank corrected methane moles",
      kind: "number",
    },
    {
      id: "methaneFluxGramsPerM2Day",
      label: "Methane flux grams per m2 day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      trapGasVolumesLiters: value.trapGasVolumesLiters as readonly number[],
      blankGasVolumesLiters: value.blankGasVolumesLiters as readonly number[],
      methaneMoleFractions: value.methaneMoleFractions as readonly number[],
      trapAreasM2: value.trapAreasM2 as readonly number[],
      deploymentDays: value.deploymentDays as readonly number[],
      gasPressurePa: value.gasPressurePa as number,
      waterVaporPressurePa: value.waterVaporPressurePa as number,
      gasTemperatureKelvin: value.gasTemperatureKelvin as number,
      gasConstantPaM3PerMoleK: value.gasConstantPaM3PerMoleK as number,
      methaneMolarMassGramsPerMole:
        value.methaneMolarMassGramsPerMole as number,
    }),
});
export const run = tool.execute;
export default tool;
