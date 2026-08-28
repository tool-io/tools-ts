import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;
const EARTH_G = 9.80665;
const M_AIR = 0.0289644;
const SEA_LEVEL_PRESSURE_HPA = 1013.25;

export const altitudeFromPressureBarometricExample = {
  input: { pressureHpa: 850, temperatureK: 288.15 },
} satisfies ToolExample<{
  readonly pressureHpa: number;
  readonly temperatureK: number;
}>;

export const altitudeFromPressureBarometricTool = createSimpleTool({
  id: "chemistry/altitude-from-pressure-barometric",
  title: "Altitude From Pressure",
  description:
    "Invert the barometric formula to estimate altitude from measured atmospheric pressure.",
  inputs: [
    {
      id: "pressureHpa",
      label: "Pressure",
      kind: "number",
      unit: "hPa",
    },
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      unit: "K",
    },
  ],
  outputs: [
    { id: "altitudeMeters", label: "Altitude", kind: "number", unit: "m" },
  ],
  calculate: (input) => {
    const pressureHpa = input.pressureHpa as number;
    const temperatureK = input.temperatureK as number;
    if (!(pressureHpa > 0))
      simpleError("pressureHpa", "Pressure must be positive.");
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    return {
      altitudeMeters:
        (-(R_GAS * temperatureK) / (EARTH_G * M_AIR)) *
        Math.log(pressureHpa / SEA_LEVEL_PRESSURE_HPA),
    };
  },
});
export const runAltitudeFromPressureBarometric =
  altitudeFromPressureBarometricTool.execute;
export default altitudeFromPressureBarometricTool;
