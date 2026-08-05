import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertLuminousIntensityInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertLuminousIntensityOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertLuminousIntensity = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "cd", measureFactors);

export const luminousIntensityExample = {
  input: { fromUnit: "cd", toUnit: "mcd", value: 1 },
  output: { unit: "mcd", value: 1000 },
} satisfies ToolExample<
  ConvertLuminousIntensityInput,
  ConvertLuminousIntensityOutput
>;

export const luminousIntensityTool = createFactorConversionTool({
  baseUnit: "cd",
  description:
    "Convert finite luminous intensity values between supported units.",
  id: "convert/luminous-intensity",
  title: "Convert Luminous Intensity",
  units: measureFactors,
});

export const runLuminousIntensity = luminousIntensityTool.execute;
export default luminousIntensityTool;
