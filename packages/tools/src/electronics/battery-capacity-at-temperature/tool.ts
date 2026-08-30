import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryCapacityAtTemperatureInput = Readonly<{
  readonly referenceCapacityAh: number;
  readonly temperatureCelsius: number;
  readonly referenceTemperatureCelsius: number;
  readonly coefficientPerCelsius: number;
}>;
export type BatteryCapacityAtTemperatureOutput = Readonly<{
  readonly capacityAh: number;
}>;

export const calculateBatteryCapacityAtTemperature = (
  x: BatteryCapacityAtTemperatureInput,
): BatteryCapacityAtTemperatureOutput => {
  if (!Number.isFinite(x.referenceCapacityAh) || x.referenceCapacityAh < 0)
    simpleError("referenceCapacityAh", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureCelsius) || x.temperatureCelsius < -273.15)
    simpleError(
      "temperatureCelsius",
      "Provide a finite number at least -273.15.",
    );
  if (
    !Number.isFinite(x.referenceTemperatureCelsius) ||
    x.referenceTemperatureCelsius < -273.15
  )
    simpleError(
      "referenceTemperatureCelsius",
      "Provide a finite number at least -273.15.",
    );
  if (!Number.isFinite(x.coefficientPerCelsius))
    simpleError("coefficientPerCelsius", "Provide a finite number.");
  if (
    1 +
      x.coefficientPerCelsius *
        (x.temperatureCelsius - x.referenceTemperatureCelsius) <
    0
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const capacityAh =
    x.referenceCapacityAh *
    (1 +
      x.coefficientPerCelsius *
        (x.temperatureCelsius - x.referenceTemperatureCelsius));
  if (!Number.isFinite(capacityAh))
    simpleError(
      "capacityAh",
      "Inputs produce an undefined or non-finite result.",
    );
  return { capacityAh: Object.is(capacityAh, -0) ? 0 : capacityAh };
};

export const example = {
  input: {
    referenceCapacityAh: 100,
    temperatureCelsius: 25,
    referenceTemperatureCelsius: 20,
    coefficientPerCelsius: 0.01,
  },
  output: { capacityAh: 105 },
} satisfies ToolExample<
  BatteryCapacityAtTemperatureInput,
  BatteryCapacityAtTemperatureOutput
>;

export const tool = createSimpleTool({
  id: "electronics/battery-capacity-at-temperature",
  title: "Battery Capacity At Temperature",
  description:
    "Linear local estimate of available battery capacity using a measured fractional temperature coefficient; not valid beyond the calibrated range.",
  inputs: [
    {
      id: "referenceCapacityAh",
      kind: "number",
      label: "Reference Capacity Ah",
      unit: "Ah",
      minimum: 0,
    },
    {
      id: "temperatureCelsius",
      kind: "number",
      label: "Temperature Celsius",
      unit: "°C",
      minimum: -273.15,
    },
    {
      id: "referenceTemperatureCelsius",
      kind: "number",
      label: "Reference Temperature Celsius",
      unit: "°C",
      minimum: -273.15,
    },
    {
      id: "coefficientPerCelsius",
      kind: "number",
      label: "Coefficient Per Celsius",
      unit: "1/°C",
    },
  ],
  outputs: [
    { id: "capacityAh", kind: "number", label: "Capacity Ah", unit: "Ah" },
  ],
  calculate: (input) =>
    calculateBatteryCapacityAtTemperature({
      referenceCapacityAh: input.referenceCapacityAh as number,
      temperatureCelsius: input.temperatureCelsius as number,
      referenceTemperatureCelsius: input.referenceTemperatureCelsius as number,
      coefficientPerCelsius: input.coefficientPerCelsius as number,
    }),
});
export const batteryCapacityAtTemperatureTool = tool;
export const runBatteryCapacityAtTemperature = tool.execute;
export default tool;
