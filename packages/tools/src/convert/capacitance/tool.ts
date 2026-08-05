import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertCapacitanceInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertCapacitanceOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertCapacitance = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "F", measureFactors);

export const capacitanceExample = {
  input: { fromUnit: "uF", toUnit: "nF", value: 1 },
  output: { unit: "nF", value: 999.9999999999999 },
} satisfies ToolExample<ConvertCapacitanceInput, ConvertCapacitanceOutput>;

export const capacitanceTool = createFactorConversionTool({
  baseUnit: "F",
  description: "Convert finite capacitance values between supported units.",
  id: "convert/capacitance",
  title: "Convert Capacitance",
  units: measureFactors,
});

export const runCapacitance = capacitanceTool.execute;
export default capacitanceTool;
