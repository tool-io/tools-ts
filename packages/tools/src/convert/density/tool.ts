import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertDensityInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertDensityOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertDensity = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "kg/m3", measureFactors);

export const densityExample = {
  input: { fromUnit: "g/cm3", toUnit: "lb/ft3", value: 1 },
  output: { unit: "lb/ft3", value: 62.427960576144606 },
} satisfies ToolExample<ConvertDensityInput, ConvertDensityOutput>;

export const densityTool = createFactorConversionTool({
  baseUnit: "kg/m3",
  description: "Convert finite density values between supported units.",
  id: "convert/density",
  title: "Convert Density",
  units: measureFactors,
});

export const runDensity = densityTool.execute;
export default densityTool;
