import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertAreaInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertAreaOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertArea = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "sqm", measureFactors);

export const areaExample = {
  input: { fromUnit: "sqft", toUnit: "sqm", value: 1 },
  output: { unit: "sqm", value: 0.09290304 },
} satisfies ToolExample<ConvertAreaInput, ConvertAreaOutput>;

export const areaTool = createFactorConversionTool({
  baseUnit: "sqm",
  description: "Convert finite area values between supported units.",
  id: "convert/area",
  title: "Convert Area",
  units: measureFactors,
});

export const runArea = areaTool.execute;
export default areaTool;
