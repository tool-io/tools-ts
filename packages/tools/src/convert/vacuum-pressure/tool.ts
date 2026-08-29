import type { ToolExample } from "../../core/example.js";
import { createFactorConversionTool } from "../factor-conversion.js";
import type { FactorUnits } from "../factor-conversion.js";

export const measureFactors = {
  Pa: { factor: 1, name: "Pa" },
  kPa: { factor: 1000, name: "kPa" },
  mbar: { factor: 100, name: "mbar" },
  bar: { factor: 100000, name: "bar" },
  Torr: { factor: 133.32236842105263, name: "Torr" },
  mTorr: { factor: 0.13332236842105263, name: "mTorr" },
  atm: { factor: 101325, name: "atm" },
} satisfies FactorUnits;

export const example = {
  input: { fromUnit: "mbar", toUnit: "Pa", value: 1 },
  output: { unit: "Pa", value: 100 },
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
    "Convert absolute vacuum pressure among pascals, torr, millibar and atmospheres. Zero denotes ideal vacuum; this tool does not interpret negative gauge pressure.",
  id: "convert/vacuum-pressure",
  title: "Vacuum Pressure Converter",
  units: measureFactors,
});
export type VacuumPressureInput = Readonly<typeof example.input>;
export type VacuumPressureOutput = Readonly<typeof example.output>;
export const vacuumPressureTool = tool;
export const runVacuumPressure = tool.execute;
export default tool;
