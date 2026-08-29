import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
  type FactorUnits,
} from "../factor-conversion.js";

export type ConvertFrequencyInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertFrequencyOutput = {
  readonly unit: string;
  readonly value: number;
};

export const frequencyFactors = {
  Hz: { factor: 1, name: "hertz" },
  GHz: { factor: 1e9, name: "gigahertz" },
  MHz: { factor: 1e6, name: "megahertz" },
  cpm: { factor: 1 / 60, name: "cycles per minute" },
  kHz: { factor: 1e3, name: "kilohertz" },
  rpm: { factor: 1 / 60, name: "revolutions per minute" },
  rps: { factor: 1, name: "revolutions per second" },
} satisfies FactorUnits;

export const convertFrequency = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "Hz", frequencyFactors);

export const frequencyExample = {
  input: { fromUnit: "rpm", toUnit: "Hz", value: 60 },
  output: { unit: "Hz", value: 1 },
} satisfies ToolExample<ConvertFrequencyInput, ConvertFrequencyOutput>;

export const frequencyTool = createFactorConversionTool({
  baseUnit: "Hz",
  description:
    "Convert periodic frequency between hertz, SI multiples, cycles per minute, and revolutions per unit time.",
  id: "convert/frequency",
  title: "Convert Frequency",
  units: frequencyFactors,
});

export const runFrequency = frequencyTool.execute;
export default frequencyTool;
