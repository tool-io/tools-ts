import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertVolumeInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertVolumeOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertVolume = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "l", measureFactors);

export const volumeExample = {
  input: { fromUnit: "pt", toUnit: "l", value: 10 },
  output: { unit: "l", value: 4.73176473 },
} satisfies ToolExample<ConvertVolumeInput, ConvertVolumeOutput>;

export const volumeTool = createFactorConversionTool({
  baseUnit: "l",
  description: "Convert finite volume values between supported units.",
  id: "convert/volume",
  title: "Convert Volume",
  units: measureFactors,
});

export const runVolume = volumeTool.execute;
export default volumeTool;
