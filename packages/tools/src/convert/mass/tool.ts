import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertMassInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertMassOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertMass = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "kg", measureFactors);

export const massExample = {
  input: { fromUnit: "lb", toUnit: "kg", value: 1 },
  output: { unit: "kg", value: 0.45359237 },
} satisfies ToolExample<ConvertMassInput, ConvertMassOutput>;

export const massTool = createFactorConversionTool({
  baseUnit: "kg",
  description: "Convert finite mass values between supported units.",
  id: "convert/mass",
  title: "Convert Mass",
  units: measureFactors,
});

export const runMass = massTool.execute;
export default massTool;
