import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TemperatureUnit = "C" | "De" | "F" | "K" | "N" | "Ra" | "Re" | "Ro";

const units: readonly TemperatureUnit[] = [
  "C",
  "De",
  "F",
  "K",
  "N",
  "Ra",
  "Re",
  "Ro",
];

const toKelvin = (value: number, unit: TemperatureUnit): number => {
  if (unit === "C") return value + 273.15;
  if (unit === "F") return ((value - 32) * 5) / 9 + 273.15;
  if (unit === "K") return value;
  if (unit === "Ra") return (value * 5) / 9;
  if (unit === "De") return 373.15 - (value * 2) / 3;
  if (unit === "N") return (value * 100) / 33 + 273.15;
  if (unit === "Re") return (value * 5) / 4 + 273.15;
  return ((value - 7.5) * 40) / 21 + 273.15;
};

const fromKelvin = (kelvin: number, unit: TemperatureUnit): number => {
  if (unit === "C") return kelvin - 273.15;
  if (unit === "F") return ((kelvin - 273.15) * 9) / 5 + 32;
  if (unit === "K") return kelvin;
  if (unit === "Ra") return (kelvin * 9) / 5;
  if (unit === "De") return ((373.15 - kelvin) * 3) / 2;
  if (unit === "N") return ((kelvin - 273.15) * 33) / 100;
  if (unit === "Re") return ((kelvin - 273.15) * 4) / 5;
  return ((kelvin - 273.15) * 21) / 40 + 7.5;
};

export const convertTemperature = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null => {
  if (
    !Number.isFinite(value) ||
    !units.includes(fromUnit as TemperatureUnit) ||
    !units.includes(toUnit as TemperatureUnit)
  )
    return null;
  const converted = fromKelvin(
    toKelvin(value, fromUnit as TemperatureUnit),
    toUnit as TemperatureUnit,
  );
  return Number.isFinite(converted) ? converted : null;
};

export const temperatureExample = {
  input: { fromUnit: "C", toUnit: "F", value: 20 },
  output: { unit: "F", value: 68 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const temperatureTool = createSimpleTool({
  id: "convert/temperature",
  title: "Convert Temperature",
  description:
    "Convert temperatures between Celsius, Fahrenheit, Kelvin, Rankine, and historical temperature scales.",
  inputs: [
    { id: "value", kind: "number", label: "Temperature" },
    { enum: units, id: "fromUnit", kind: "string", label: "From scale" },
    { enum: units, id: "toUnit", kind: "string", label: "To scale" },
  ],
  outputs: [
    { id: "value", kind: "number", label: "Converted temperature" },
    { enum: units, id: "unit", kind: "string", label: "Scale" },
  ],
  calculate: (input) => {
    const value = convertTemperature(
      input.value as number,
      input.fromUnit as string,
      input.toUnit as string,
    );
    if (value === null)
      simpleError("value", "Enter a finite temperature and supported scales.");
    return { unit: input.toUnit, value };
  },
});

export const runTemperature = temperatureTool.execute;
export default temperatureTool;
