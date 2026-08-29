import type { ToolExample } from "../../core/example.js";
import { createFactorConversionTool } from "../factor-conversion.js";
import type { FactorUnits } from "../factor-conversion.js";

export const measureFactors = {
  W: { factor: 1, name: "W" },
  mW: { factor: 0.001, name: "mW" },
  kW: { factor: 1000, name: "kW" },
  MW: { factor: 1000000, name: "MW" },
  "hp(mechanical)": { factor: 745.6998715822702, name: "hp(mechanical)" },
  "hp(metric)": { factor: 735.49875, name: "hp(metric)" },
  "ton(refrigeration)": { factor: 3516.8528420667, name: "ton(refrigeration)" },
} satisfies FactorUnits;

export const example = {
  input: { fromUnit: "kW", toUnit: "W", value: 1 },
  output: { unit: "W", value: 1000 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const tool = createFactorConversionTool({
  baseUnit: "W",
  description:
    "Convert power among watts, metric and mechanical horsepower, and refrigeration tons; refrigeration ton means 12,000 BTU per hour.",
  id: "convert/power",
  title: "Power Converter",
  units: measureFactors,
});
export type PowerInput = Readonly<typeof example.input>;
export type PowerOutput = Readonly<typeof example.output>;
export const powerTool = tool;
export const runPower = tool.execute;
export default tool;
