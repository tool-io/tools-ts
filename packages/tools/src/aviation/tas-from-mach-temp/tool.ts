import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TasFromMachTempInput = {
  readonly machNumber: number;
  readonly oatC: number;
};

export type TasFromMachTempOutput = {
  readonly tasKt: number;
};

const GAMMA_AIR = 1.4;
const DRY_AIR_GAS_CONSTANT = 287.05287;
const MS_PER_KT = 0.514444;

export const tasFromMachTempExample = {
  input: { machNumber: 0.8, oatC: -50 },
  output: { tasKt: 465.6882613067003 },
} satisfies ToolExample<TasFromMachTempInput, TasFromMachTempOutput>;

export const calculateTasFromMachTemp = (
  input: TasFromMachTempInput,
): TasFromMachTempOutput => {
  if (input.machNumber <= 0)
    simpleError(
      "machNumber",
      "The Mach number must be greater than zero.",
      "invalid_mach_number",
    );
  const temperatureK = input.oatC + 273.15;
  const speedOfSoundMs = Math.sqrt(
    GAMMA_AIR * DRY_AIR_GAS_CONSTANT * temperatureK,
  );
  return { tasKt: (input.machNumber * speedOfSoundMs) / MS_PER_KT };
};

export const tasFromMachTempTool = createSimpleTool({
  calculate: (input) =>
    calculateTasFromMachTemp(input as unknown as TasFromMachTempInput),
  description:
    "Convert a Mach number and outside air temperature to true airspeed via the local speed of sound.",
  id: "aviation/tas-from-mach-temp",
  inputs: [
    {
      description: "Flight Mach number.",
      id: "machNumber",
      kind: "number",
      label: "Mach number",
      maximum: 5,
      minimum: 0,
    },
    {
      description: "Outside air temperature in degrees Celsius.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      maximum: 60,
      minimum: -90,
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "True airspeed through the airmass.",
      format: "speed",
      id: "tasKt",
      kind: "number",
      label: "TAS",
      unit: "kt",
    },
  ],
  title: "TAS from Mach Temperature Calculator",
});
export const runTasFromMachTemp = tasFromMachTempTool.execute;
export default tasFromMachTempTool;
