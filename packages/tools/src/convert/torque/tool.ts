import type { ToolExample } from "../../core/example.js";
import { createFactorConversionTool } from "../factor-conversion.js";
import type { FactorUnits } from "../factor-conversion.js";

export const measureFactors = {
  "N·m": { factor: 1, name: "N·m" },
  "mN·m": { factor: 0.001, name: "mN·m" },
  "lbf·ft": { factor: 1.3558179483314003, name: "lbf·ft" },
  "lbf·in": { factor: 0.1129848290276167, name: "lbf·in" },
  "kgf·m": { factor: 9.80665, name: "kgf·m" },
} satisfies FactorUnits;

export const example = {
  input: { fromUnit: "kgf·m", toUnit: "N·m", value: 1 },
  output: { unit: "N·m", value: 9.80665 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const tool = createFactorConversionTool({
  baseUnit: "N·m",
  description:
    "Convert torque between newton-metres, pound-force feet, and kilogram-force metres. Torque has the dimensions of energy but is not an energy quantity.",
  id: "convert/torque",
  title: "Torque Converter",
  units: measureFactors,
});
export type TorqueInput = Readonly<typeof example.input>;
export type TorqueOutput = Readonly<typeof example.output>;
export const torqueTool = tool;
export const runTorque = tool.execute;
export default tool;
