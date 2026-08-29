import type { ToolExample } from "../../core/example.js";
import {
  createDimensionalConversionTool,
  type DimensionalUnit,
} from "../dimensional-conversion.js";

export const units = {
  "kg/m²": { dimension: "surface", factor: 1 },
  "g/m²": { dimension: "surface", factor: 0.001 },
  "lb/ft²": { dimension: "surface", factor: 4.88242763638305 },
  "kg/m": { dimension: "linear", factor: 1 },
  "g/m": { dimension: "linear", factor: 0.001 },
  "lb/ft": { dimension: "linear", factor: 1.4881639435695537 },
} satisfies Readonly<Record<string, DimensionalUnit>>;
export const example = {
  input: { fromUnit: "g/m²", toUnit: "kg/m²", value: 1000 },
  output: { unit: "kg/m²", value: 1 },
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
    "Convert mass per area or mass per length, keeping surface and linear density separate.",
  id: "convert/surface-linear-density",
  title: "Surface and Linear Density Converter",
  units,
});
export type SurfaceLinearDensityInput = Readonly<typeof example.input>;
export type SurfaceLinearDensityOutput = Readonly<typeof example.output>;
export const surfaceLinearDensityTool = tool;
export const runSurfaceLinearDensity = tool.execute;
export default tool;
