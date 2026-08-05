import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertElectricCurrentInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertElectricCurrentOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertElectricCurrent = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "A", measureFactors);

export const electricCurrentExample = {
  input: { fromUnit: "A", toUnit: "mA", value: 1 },
  output: { unit: "mA", value: 1000 },
} satisfies ToolExample<
  ConvertElectricCurrentInput,
  ConvertElectricCurrentOutput
>;

export const electricCurrentTool = createFactorConversionTool({
  baseUnit: "A",
  description:
    "Convert finite electric current values between supported units.",
  id: "convert/electric-current",
  title: "Convert Electric Current",
  units: measureFactors,
});

export const runElectricCurrent = electricCurrentTool.execute;
export default electricCurrentTool;
