import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
  type FactorUnits,
} from "../factor-conversion.js";

export type ConvertForceInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertForceOutput = {
  readonly unit: string;
  readonly value: number;
};

export const forceFactors = {
  N: { factor: 1, name: "newton" },
  kN: { factor: 1_000, name: "kilonewton" },
  dyn: { factor: 1e-5, name: "dyne" },
  kgf: { factor: 9.80665, name: "kilogram-force" },
  lbf: { factor: 4.4482216152605, name: "pound-force" },
  ozf: { factor: 0.278013850953781, name: "ounce-force" },
} satisfies FactorUnits;

export const convertForce = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "N", forceFactors);

export const forceExample = {
  input: { fromUnit: "kgf", toUnit: "N", value: 1 },
  output: { unit: "N", value: 9.80665 },
} satisfies ToolExample<ConvertForceInput, ConvertForceOutput>;

export const forceTool = createFactorConversionTool({
  baseUnit: "N",
  description:
    "Convert finite force values between newtons, dynes, kilogram-force, pound-force, and ounce-force.",
  id: "convert/force",
  title: "Convert Force",
  units: forceFactors,
});

export const runForce = forceTool.execute;
export default forceTool;
