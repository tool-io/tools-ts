import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertTimeInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertTimeOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertTime = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "s", measureFactors);

export const timeExample = {
  input: { fromUnit: "h", toUnit: "min", value: 1 },
  output: { unit: "min", value: 60 },
} satisfies ToolExample<ConvertTimeInput, ConvertTimeOutput>;

export const timeTool = createFactorConversionTool({
  baseUnit: "s",
  description: "Convert finite time values between supported units.",
  id: "convert/time",
  title: "Convert Time",
  units: measureFactors,
});

export const runTime = timeTool.execute;
export default timeTool;
