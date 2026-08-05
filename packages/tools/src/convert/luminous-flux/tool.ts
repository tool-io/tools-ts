import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertLuminousFluxInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertLuminousFluxOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertLuminousFlux = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "lm", measureFactors);

export const luminousFluxExample = {
  input: { fromUnit: "lm", toUnit: "klm", value: 1 },
  output: { unit: "klm", value: 0.001 },
} satisfies ToolExample<ConvertLuminousFluxInput, ConvertLuminousFluxOutput>;

export const luminousFluxTool = createFactorConversionTool({
  baseUnit: "lm",
  description: "Convert finite luminous flux values between supported units.",
  id: "convert/luminous-flux",
  title: "Convert Luminous Flux",
  units: measureFactors,
});

export const runLuminousFlux = luminousFluxTool.execute;
export default luminousFluxTool;
