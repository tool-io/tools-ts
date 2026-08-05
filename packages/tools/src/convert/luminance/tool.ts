import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertLuminanceInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertLuminanceOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertLuminance = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "cd/m2", measureFactors);

export const luminanceExample = {
  input: { fromUnit: "nit", toUnit: "fL", value: 100 },
  output: { unit: "fL", value: 29.18635079601587 },
} satisfies ToolExample<ConvertLuminanceInput, ConvertLuminanceOutput>;

export const luminanceTool = createFactorConversionTool({
  baseUnit: "cd/m2",
  description: "Convert finite luminance values between supported units.",
  id: "convert/luminance",
  title: "Convert Luminance",
  units: measureFactors,
});

export const runLuminance = luminanceTool.execute;
export default luminanceTool;
