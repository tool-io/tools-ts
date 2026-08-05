import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertElectricalResistanceInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertElectricalResistanceOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertElectricalResistance = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "ohm", measureFactors);

export const electricalResistanceExample = {
  input: { fromUnit: "kohm", toUnit: "ohm", value: 1 },
  output: { unit: "ohm", value: 1000 },
} satisfies ToolExample<
  ConvertElectricalResistanceInput,
  ConvertElectricalResistanceOutput
>;

export const electricalResistanceTool = createFactorConversionTool({
  baseUnit: "ohm",
  description:
    "Convert finite electrical resistance values between supported units.",
  id: "convert/electrical-resistance",
  title: "Convert Electrical Resistance",
  units: measureFactors,
});

export const runElectricalResistance = electricalResistanceTool.execute;
export default electricalResistanceTool;
