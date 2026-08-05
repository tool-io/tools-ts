import type { ToolExample } from "../../core/example.js";
import {
  convertByFactors,
  createFactorConversionTool,
} from "../factor-conversion.js";
import { measureFactors } from "./factors.js";

export type ConvertDigitalStorageInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertDigitalStorageOutput = {
  readonly unit: string;
  readonly value: number;
};

export const convertDigitalStorage = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null =>
  convertByFactors(value, fromUnit, toUnit, "b", measureFactors);

export const digitalStorageExample = {
  input: { fromUnit: "GB", toUnit: "GiB", value: 1 },
  output: { unit: "GiB", value: 0.9313225746154785 },
} satisfies ToolExample<
  ConvertDigitalStorageInput,
  ConvertDigitalStorageOutput
>;

export const digitalStorageTool = createFactorConversionTool({
  baseUnit: "b",
  description: "Convert finite digital storage values between supported units.",
  id: "convert/digital-storage",
  title: "Convert Digital Storage",
  units: measureFactors,
});

export const runDigitalStorage = digitalStorageTool.execute;
export default digitalStorageTool;
