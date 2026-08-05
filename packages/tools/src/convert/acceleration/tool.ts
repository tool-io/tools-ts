import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertAccelerationInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertAccelerationOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertAcceleration = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "m/s2", measureFactors);

export const accelerationExample = {
  input: { fromUnit: "ft/s2", toUnit: "m/s2", value: 1 },
  output: { unit: "m/s2", value: 0.3048 },
} satisfies ToolExample<ConvertAccelerationInput, ConvertAccelerationOutput>;

export const accelerationTool = createFactorConversionTool({
  baseUnit: "m/s2",
  description: "Convert finite acceleration values between supported units.",
  id: "convert/acceleration",
  title: "Convert Acceleration",
  units: measureFactors,
});

export const runAcceleration = accelerationTool.execute;
export default accelerationTool;
