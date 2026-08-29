import type { ToolExample } from "../../core/example.js";
import {
  createDimensionalConversionTool,
  type DimensionalUnit,
} from "../dimensional-conversion.js";

export const units = {
  "J/m³": { dimension: "volumetric", factor: 1 },
  "kJ/m³": { dimension: "volumetric", factor: 1000 },
  "J/L": { dimension: "volumetric", factor: 1000 },
  "Wh/L": { dimension: "volumetric", factor: 3600000 },
  "J/m²": { dimension: "areal", factor: 1 },
  "kJ/m²": { dimension: "areal", factor: 1000 },
  "Wh/m²": { dimension: "areal", factor: 3600 },
} satisfies Readonly<Record<string, DimensionalUnit>>;
export const example = {
  input: { fromUnit: "kJ/m²", toUnit: "J/m²", value: 1 },
  output: { unit: "J/m²", value: 1000 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;
export const tool = createDimensionalConversionTool({
  description:
    "Convert energy per volume or per area without treating the two dimensions as interchangeable.",
  id: "convert/energy-density",
  title: "Volumetric and Areal Energy Density Converter",
  units,
});
export type EnergyDensityInput = Readonly<typeof example.input>;
export type EnergyDensityOutput = Readonly<typeof example.output>;
export const energyDensityTool = tool;
export const runEnergyDensity = tool.execute;
export default tool;
