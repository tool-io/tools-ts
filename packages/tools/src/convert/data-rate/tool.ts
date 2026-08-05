import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertDataRateInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertDataRateOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertDataRate = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "b/s", measureFactors);

export const dataRateExample = {
  input: { fromUnit: "Mb/s", toUnit: "MB/s", value: 100 },
  output: { unit: "MB/s", value: 12.5 },
} satisfies ToolExample<ConvertDataRateInput, ConvertDataRateOutput>;

export const dataRateTool = createFactorConversionTool({
  baseUnit: "b/s",
  description: "Convert finite data rate values between supported units.",
  id: "convert/data-rate",
  title: "Convert Data Rate",
  units: measureFactors,
});

export const runDataRate = dataRateTool.execute;
export default dataRateTool;
