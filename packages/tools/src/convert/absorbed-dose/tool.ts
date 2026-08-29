import type { ToolExample } from "../../core/example.js";
import { createFactorConversionTool } from "../factor-conversion.js";
import type { FactorUnits } from "../factor-conversion.js";

export const measureFactors = {
  Gy: { factor: 1, name: "Gy" },
  mGy: { factor: 0.001, name: "mGy" },
  uGy: { factor: 0.000001, name: "uGy" },
  rad: { factor: 0.01, name: "rad" },
  mrad: { factor: 0.00001, name: "mrad" },
} satisfies FactorUnits;

export const example = {
  input: { fromUnit: "rad", toUnit: "Gy", value: 100 },
  output: { unit: "Gy", value: 1 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const tool = createFactorConversionTool({
  baseUnit: "Gy",
  description:
    "Convert absorbed radiation dose between grays and rads; this is energy deposited per unit mass, not equivalent dose.",
  id: "convert/absorbed-dose",
  title: "Absorbed Dose Converter",
  units: measureFactors,
});
export type AbsorbedDoseInput = Readonly<typeof example.input>;
export type AbsorbedDoseOutput = Readonly<typeof example.output>;
export const absorbedDoseTool = tool;
export const runAbsorbedDose = tool.execute;
export default tool;
