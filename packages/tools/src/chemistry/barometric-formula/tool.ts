import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const R_GAS = 8.314462618;
const EARTH_G = 9.80665;
const M_AIR = 0.0289644;
const SEA_LEVEL_PRESSURE_HPA = 1013.25;

export const barometricFormulaExample = {
  input: { altitudeMeters: 1500, temperatureK: 288.15 },
} satisfies ToolExample<{
  readonly altitudeMeters: number;
  readonly temperatureK: number;
}>;

export const barometricFormulaTool = createSimpleTool({
  id: "chemistry/barometric-formula",
  title: "Barometric Pressure",
  description:
    "Estimate atmospheric pressure at altitude from temperature using the barometric formula.",
  inputs: [
    {
      id: "altitudeMeters",
      label: "Altitude",
      kind: "number",
      maximum: 12000,
      minimum: -500,
      unit: "m",
    },
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      maximum: 350,
      minimum: 200,
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "pressureHpa",
      label: "Atmospheric pressure",
      kind: "number",
      unit: "hPa",
    },
  ],
  calculate: (input) => {
    const altitudeMeters = input.altitudeMeters as number;
    const temperatureK = input.temperatureK as number;
    return {
      pressureHpa:
        SEA_LEVEL_PRESSURE_HPA *
        Math.exp((-EARTH_G * M_AIR * altitudeMeters) / (R_GAS * temperatureK)),
    };
  },
});
export const runBarometricFormula = barometricFormulaTool.execute;
export default barometricFormulaTool;
