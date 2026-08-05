import { createSimpleTool, simpleError } from "../core/simple.js";

export type FactorUnit = {
  readonly cite?: string;
  readonly factor: number;
  readonly name: string;
};

export type FactorUnits = Readonly<Record<string, FactorUnit>>;

export const convertByFactors = (
  value: number,
  fromUnit: string,
  toUnit: string,
  baseUnit: string,
  units: FactorUnits,
): number | null => {
  if (!Number.isFinite(value) || !fromUnit || !toUnit) return null;
  const fromFactor = fromUnit === baseUnit ? 1 : units[fromUnit]?.factor;
  const toFactor = toUnit === baseUnit ? 1 : units[toUnit]?.factor;
  if (
    fromFactor === undefined ||
    toFactor === undefined ||
    !Number.isFinite(fromFactor) ||
    !Number.isFinite(toFactor) ||
    toFactor === 0
  )
    return null;
  const converted = (value * fromFactor) / toFactor;
  return Number.isFinite(converted) ? converted : null;
};

export type FactorConversionConfig = {
  readonly baseUnit: string;
  readonly description: string;
  readonly id: string;
  readonly title: string;
  readonly units: FactorUnits;
};

export const createFactorConversionTool = (config: FactorConversionConfig) =>
  createSimpleTool({
    id: config.id,
    title: config.title,
    description: config.description,
    inputs: [
      { id: "value", kind: "number", label: "Value" },
      {
        enum: Object.keys(config.units),
        id: "fromUnit",
        kind: "string",
        label: "From unit",
      },
      {
        enum: Object.keys(config.units),
        id: "toUnit",
        kind: "string",
        label: "To unit",
      },
    ],
    outputs: [
      { id: "value", kind: "number", label: "Converted value" },
      {
        enum: Object.keys(config.units),
        id: "unit",
        kind: "string",
        label: "Unit",
      },
    ],
    calculate: (input) => {
      const value = convertByFactors(
        input.value as number,
        input.fromUnit as string,
        input.toUnit as string,
        config.baseUnit,
        config.units,
      );
      if (value === null)
        simpleError("value", "Enter a finite value and supported units.");
      return { unit: input.toUnit, value };
    },
  });
