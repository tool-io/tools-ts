import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertIlluminanceInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertIlluminanceOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertIlluminance = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "lx", measureFactors);

export const illuminanceExample = {
  input: { fromUnit: "fc", toUnit: "lx", value: 100 },
  output: { unit: "lx", value: 1076.3910416709723 },
} satisfies ToolExample<ConvertIlluminanceInput, ConvertIlluminanceOutput>;

export const illuminanceTool = createFactorConversionTool({
  baseUnit: "lx",
  description: "Convert finite illuminance values between supported units.",
  id: "convert/illuminance",
  title: "Convert Illuminance",
  units: measureFactors,
});

export const runIlluminance = illuminanceTool.execute;
export default illuminanceTool;
