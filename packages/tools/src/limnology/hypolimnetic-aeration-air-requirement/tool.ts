import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly oxygenDemandKgPerDay: number;
  readonly airDensityKgPerM3: number;
  readonly oxygenMassFractionInAir: number;
  readonly fieldOxygenTransferFraction: number;
  readonly operatingHoursPerDay: number;
}>;
export type Output = Readonly<{
  readonly requiredAirVolumeM3PerDay: number;
  readonly requiredOperatingAirFlowM3PerHour: number;
}>;
const inputFields = [
  {
    id: "oxygenDemandKgPerDay",
    label: "Oxygen demand kg per day",
    kind: "number",
  },
  { id: "airDensityKgPerM3", label: "Air density kg per m3", kind: "number" },
  {
    id: "oxygenMassFractionInAir",
    label: "Oxygen mass fraction in air",
    kind: "number",
  },
  {
    id: "fieldOxygenTransferFraction",
    label: "Field oxygen transfer fraction",
    kind: "number",
  },
  {
    id: "operatingHoursPerDay",
    label: "Operating hours per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.airDensityKgPerM3, "airDensityKgPerM3");
  positive(input.oxygenMassFractionInAir, "oxygenMassFractionInAir");
  positive(input.fieldOxygenTransferFraction, "fieldOxygenTransferFraction");
  positive(input.operatingHoursPerDay, "operatingHoursPerDay");
  nonnegative(input.oxygenDemandKgPerDay, "oxygenDemandKgPerDay");
  fraction(input.oxygenMassFractionInAir, "oxygenMassFractionInAir");
  fraction(input.fieldOxygenTransferFraction, "fieldOxygenTransferFraction");
  if (input.operatingHoursPerDay > 24)
    simpleError(
      "operatingHoursPerDay",
      "Operating day cannot exceed 24 hours.",
    );
  const requiredAirVolumeM3PerDay =
    input.oxygenDemandKgPerDay /
    (input.airDensityKgPerM3 *
      input.oxygenMassFractionInAir *
      input.fieldOxygenTransferFraction);
  return {
    requiredAirVolumeM3PerDay,
    requiredOperatingAirFlowM3PerHour:
      requiredAirVolumeM3PerDay / input.operatingHoursPerDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  oxygenDemandKgPerDay: 10,
  airDensityKgPerM3: 1.2,
  oxygenMassFractionInAir: 0.25,
  fieldOxygenTransferFraction: 0.5,
  operatingHoursPerDay: 20,
} satisfies Input;
export const exampleOutput = {
  requiredAirVolumeM3PerDay: 66.66666666666667,
  requiredOperatingAirFlowM3PerHour: 3.3333333333333335,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/hypolimnetic-aeration-air-requirement",
  title: "Hypolimnetic Aeration Air Requirement",
  description:
    "Convert hypolimnetic oxygen demand to supplied-condition air volume/operating flow using air oxygen mass content and field transfer; unlike rated oxygen-transfer capacity, this sizes gas flow, not aeration equipment or mixing effects.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredAirVolumeM3PerDay",
      label: "Required air volume m3 per day",
      kind: "number",
    },
    {
      id: "requiredOperatingAirFlowM3PerHour",
      label: "Required operating air flow m3 per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      oxygenDemandKgPerDay: value.oxygenDemandKgPerDay as number,
      airDensityKgPerM3: value.airDensityKgPerM3 as number,
      oxygenMassFractionInAir: value.oxygenMassFractionInAir as number,
      fieldOxygenTransferFraction: value.fieldOxygenTransferFraction as number,
      operatingHoursPerDay: value.operatingHoursPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
