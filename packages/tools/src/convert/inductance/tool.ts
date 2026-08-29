import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertInductanceInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertInductanceOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertInductance = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "H", measureFactors);

export const inductanceExample = {
  input: { fromUnit: "H", toUnit: "mH", value: 1 },
  output: { unit: "mH", value: 1000 },
} satisfies ToolExample<ConvertInductanceInput, ConvertInductanceOutput>;

export const inductanceTool = createFactorConversionTool({
  baseUnit: "H",
  description:
    "Convert inductance across every SI-prefixed henry, CGS abhenry and stathenry, and equivalent Wb/A, V·s/A, or ohm·s notation. CGS stathenry uses NIST's rounded factor.",
  id: "convert/inductance",
  title: "Convert Inductance",
  units: measureFactors,
});

export const runInductance = inductanceTool.execute;
export default inductanceTool;
