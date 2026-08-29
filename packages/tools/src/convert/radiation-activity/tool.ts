import type { ToolExample } from "../../core/example.js";
import { createFactorConversionTool } from "../factor-conversion.js";
import type { FactorUnits } from "../factor-conversion.js";

export const measureFactors = {
  Bq: { factor: 1, name: "Bq" },
  kBq: { factor: 1000, name: "kBq" },
  MBq: { factor: 1000000, name: "MBq" },
  GBq: { factor: 1000000000, name: "GBq" },
  Ci: { factor: 37000000000, name: "Ci" },
  mCi: { factor: 37000000, name: "mCi" },
  uCi: { factor: 37000, name: "uCi" },
} satisfies FactorUnits;

export const example = {
  input: { fromUnit: "Ci", toUnit: "Bq", value: 1 },
  output: { unit: "Bq", value: 37000000000 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const tool = createFactorConversionTool({
  baseUnit: "Bq",
  description:
    "Convert radioactive decay activity between becquerels and curies; 1 curie is exactly 37 billion becquerels.",
  id: "convert/radiation-activity",
  title: "Radioactivity Converter",
  units: measureFactors,
});
export type RadiationActivityInput = Readonly<typeof example.input>;
export type RadiationActivityOutput = Readonly<typeof example.output>;
export const radiationActivityTool = tool;
export const runRadiationActivity = tool.execute;
export default tool;
