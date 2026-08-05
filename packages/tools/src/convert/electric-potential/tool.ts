import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertElectricPotentialInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertElectricPotentialOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertElectricPotential = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "V", measureFactors);

export const electricPotentialExample = {
  input: { fromUnit: "V", toUnit: "mV", value: 120 },
  output: { unit: "mV", value: 120000 },
} satisfies ToolExample<
  ConvertElectricPotentialInput,
  ConvertElectricPotentialOutput
>;

export const electricPotentialTool = createFactorConversionTool({
  baseUnit: "V",
  description:
    "Convert finite electric potential values between supported units.",
  id: "convert/electric-potential",
  title: "Convert Electric Potential",
  units: measureFactors,
});

export const runElectricPotential = electricPotentialTool.execute;
export default electricPotentialTool;
