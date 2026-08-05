import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertEnergyInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertEnergyOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertEnergy = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "J", measureFactors);

export const energyExample = {
  input: { fromUnit: "kWh", toUnit: "Btu-IT", value: 1 },
  output: { unit: "Btu-IT", value: 3412.141633127942 },
} satisfies ToolExample<ConvertEnergyInput, ConvertEnergyOutput>;

export const energyTool = createFactorConversionTool({
  baseUnit: "J",
  description: "Convert finite energy values between supported units.",
  id: "convert/energy",
  title: "Convert Energy",
  units: measureFactors,
});

export const runEnergy = energyTool.execute;
export default energyTool;
