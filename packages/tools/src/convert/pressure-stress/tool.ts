import type { ToolExample } from "../../core/example.js";
import { createFactorConversionTool } from "../factor-conversion.js";
import type { FactorUnits } from "../factor-conversion.js";

export const measureFactors = {
  Pa: { factor: 1, name: "Pa" },
  kPa: { factor: 1000, name: "kPa" },
  MPa: { factor: 1000000, name: "MPa" },
  bar: { factor: 100000, name: "bar" },
  mbar: { factor: 100, name: "mbar" },
  atm: { factor: 101325, name: "atm" },
  Torr: { factor: 133.32236842105263, name: "Torr" },
  psi: { factor: 6894.757293168, name: "psi" },
} satisfies FactorUnits;

export const example = {
  input: { fromUnit: "bar", toUnit: "Pa", value: 1 },
  output: { unit: "Pa", value: 100000 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const tool = createFactorConversionTool({
  baseUnit: "Pa",
  description:
    "Convert pressure or mechanical stress among pascals, bars, atmospheres, torr, and pounds per square inch. Inputs represent absolute magnitudes, not gauge offsets.",
  id: "convert/pressure-stress",
  title: "Pressure and Stress Converter",
  units: measureFactors,
});
export type PressureStressInput = Readonly<typeof example.input>;
export type PressureStressOutput = Readonly<typeof example.output>;
export const pressureStressTool = tool;
export const runPressureStress = tool.execute;
export default tool;
