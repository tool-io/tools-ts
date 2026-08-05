import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertAngularVelocityInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertAngularVelocityOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertAngularVelocity = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "rad/s", measureFactors);

export const angularVelocityExample = {
  input: { fromUnit: "rpm", toUnit: "rad/s", value: 60 },
  output: { unit: "rad/s", value: 6.283185307179586 },
} satisfies ToolExample<
  ConvertAngularVelocityInput,
  ConvertAngularVelocityOutput
>;

export const angularVelocityTool = createFactorConversionTool({
  baseUnit: "rad/s",
  description:
    "Convert finite angular velocity values between supported units.",
  id: "convert/angular-velocity",
  title: "Convert Angular Velocity",
  units: measureFactors,
});

export const runAngularVelocity = angularVelocityTool.execute;
export default angularVelocityTool;
