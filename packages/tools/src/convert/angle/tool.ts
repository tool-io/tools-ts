import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertAngleInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertAngleOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertAngle = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "rad", measureFactors);

export const angleExample = {
  input: { fromUnit: "deg", toUnit: "rad", value: 180 },
  output: { unit: "rad", value: 3.141592653589793 },
} satisfies ToolExample<ConvertAngleInput, ConvertAngleOutput>;

export const angleTool = createFactorConversionTool({
  baseUnit: "rad",
  description: "Convert finite angle values between supported units.",
  id: "convert/angle",
  title: "Convert Angle",
  units: measureFactors,
});

export const runAngle = angleTool.execute;
export default angleTool;
