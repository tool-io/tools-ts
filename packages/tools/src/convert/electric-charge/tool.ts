import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertElectricChargeInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertElectricChargeOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertElectricCharge = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "C", measureFactors);

export const electricChargeExample = {
  input: { fromUnit: "Ah", toUnit: "C", value: 1 },
  output: { unit: "C", value: 3600 },
} satisfies ToolExample<
  ConvertElectricChargeInput,
  ConvertElectricChargeOutput
>;

export const electricChargeTool = createFactorConversionTool({
  baseUnit: "C",
  description: "Convert finite electric charge values between supported units.",
  id: "convert/electric-charge",
  title: "Convert Electric Charge",
  units: measureFactors,
});

export const runElectricCharge = electricChargeTool.execute;
export default electricChargeTool;
