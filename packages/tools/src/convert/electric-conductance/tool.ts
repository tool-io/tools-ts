import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertElectricConductanceInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertElectricConductanceOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertElectricConductance = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "S", measureFactors);

export const electricConductanceExample = {
  input: { fromUnit: "mS", toUnit: "uS", value: 1 },
  output: { unit: "uS", value: 1000.0000000000001 },
} satisfies ToolExample<
  ConvertElectricConductanceInput,
  ConvertElectricConductanceOutput
>;

export const electricConductanceTool = createFactorConversionTool({
  baseUnit: "S",
  description:
    "Convert finite electric conductance values between supported units.",
  id: "convert/electric-conductance",
  title: "Convert Electric Conductance",
  units: measureFactors,
});

export const runElectricConductance = electricConductanceTool.execute;
export default electricConductanceTool;
