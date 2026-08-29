import type { ToolExample } from "../../core/example.js";
import { createFactorConversionTool } from "../factor-conversion.js";
import type { FactorUnits } from "../factor-conversion.js";

export const measureFactors = {
  Wb: { factor: 1, name: "Wb" },
  mWb: { factor: 0.001, name: "mWb" },
  uWb: { factor: 0.000001, name: "uWb" },
  Mx: { factor: 1e-8, name: "Mx" },
  "V·s": { factor: 1, name: "V·s" },
} satisfies FactorUnits;

export const example = {
  input: { fromUnit: "Wb", toUnit: "Mx", value: 1 },
  output: { unit: "Mx", value: 100000000 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const tool = createFactorConversionTool({
  baseUnit: "Wb",
  description:
    "Convert magnetic flux among webers, volt-seconds, and maxwells; 1 maxwell equals 10⁻⁸ weber.",
  id: "convert/magnetic-flux",
  title: "Magnetic Flux Converter",
  units: measureFactors,
});
export type MagneticFluxInput = Readonly<typeof example.input>;
export type MagneticFluxOutput = Readonly<typeof example.output>;
export const magneticFluxTool = tool;
export const runMagneticFlux = tool.execute;
export default tool;
