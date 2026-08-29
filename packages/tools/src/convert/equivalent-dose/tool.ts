import type { ToolExample } from "../../core/example.js";
import { createFactorConversionTool } from "../factor-conversion.js";
import type { FactorUnits } from "../factor-conversion.js";

export const measureFactors = {
  Sv: { factor: 1, name: "Sv" },
  mSv: { factor: 0.001, name: "mSv" },
  uSv: { factor: 0.000001, name: "uSv" },
  rem: { factor: 0.01, name: "rem" },
  mrem: { factor: 0.00001, name: "mrem" },
} satisfies FactorUnits;

export const example = {
  input: { fromUnit: "rem", toUnit: "Sv", value: 100 },
  output: { unit: "Sv", value: 1 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const tool = createFactorConversionTool({
  baseUnit: "Sv",
  description:
    "Convert radiation equivalent dose between sieverts and rem; do not use these units as absorbed-dose grays.",
  id: "convert/equivalent-dose",
  title: "Equivalent Dose Converter",
  units: measureFactors,
});
export type EquivalentDoseInput = Readonly<typeof example.input>;
export type EquivalentDoseOutput = Readonly<typeof example.output>;
export const equivalentDoseTool = tool;
export const runEquivalentDose = tool.execute;
export default tool;
