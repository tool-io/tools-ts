import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertAmountOfSubstanceInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertAmountOfSubstanceOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertAmountOfSubstance = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "mol", measureFactors);

export const amountOfSubstanceExample = {
  input: { fromUnit: "mol", toUnit: "mmol", value: 1 },
  output: { unit: "mmol", value: 1000 },
} satisfies ToolExample<
  ConvertAmountOfSubstanceInput,
  ConvertAmountOfSubstanceOutput
>;

export const amountOfSubstanceTool = createFactorConversionTool({
  baseUnit: "mol",
  description:
    "Convert finite amount of substance values between supported units.",
  id: "convert/amount-of-substance",
  title: "Convert Amount of Substance",
  units: measureFactors,
});

export const runAmountOfSubstance = amountOfSubstanceTool.execute;
export default amountOfSubstanceTool;
