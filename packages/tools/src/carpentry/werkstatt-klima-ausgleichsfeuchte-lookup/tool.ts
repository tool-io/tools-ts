import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const emcTemperaturesC = [10, 20, 30];
const emcHumidityPercents = [30, 50, 70, 90];
const emcValuesPercent = [
  [7.5, 11, 14.5, 18.5],
  [6.5, 9.5, 12.5, 16.5],
  [5.5, 8, 11, 15],
];

export const equilibriumMoistureLookupExample = {
  input: { relativeHumidityPercent: 50, temperatureC: 20 },
  output: { equilibriumMoisturePercent: 9.5 },
} satisfies ToolExample<
  {
    readonly relativeHumidityPercent: number;
    readonly temperatureC: number;
  },
  { readonly equilibriumMoisturePercent: number }
>;

export const equilibriumMoistureLookupTool = createSimpleTool({
  id: "carpentry/werkstatt-klima-ausgleichsfeuchte-lookup",
  title: "Equilibrium Moisture Lookup",
  description:
    "Look up equilibrium moisture content of wood by temperature and relative humidity with bilinear interpolation.",
  inputs: [
    {
      description: "Wood temperature in degrees Celsius.",
      id: "temperatureC",
      kind: "number",
      label: "Temperature",
      maximum: 30,
      minimum: 10,
      unit: "°C",
    },
    {
      description: "Relative humidity in percent.",
      id: "relativeHumidityPercent",
      kind: "number",
      label: "Relative humidity",
      maximum: 90,
      minimum: 30,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Equilibrium moisture content in percent.",
      id: "equilibriumMoisturePercent",
      kind: "number",
      label: "Equilibrium moisture",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const temperatureC = Math.min(
      30,
      Math.max(10, input.temperatureC as number),
    );
    const relativeHumidityPercent = Math.min(
      90,
      Math.max(30, input.relativeHumidityPercent as number),
    );
    const tIndex = Math.min(
      emcTemperaturesC.length - 1,
      (temperatureC - 10) / 10,
    );
    const hIndex = Math.min(
      emcHumidityPercents.length - 1,
      (relativeHumidityPercent - 30) / 20,
    );
    const t0 = Math.floor(tIndex);
    const h0 = Math.floor(hIndex);
    const t1 = Math.min(emcTemperaturesC.length - 1, t0 + 1);
    const h1 = Math.min(emcHumidityPercents.length - 1, h0 + 1);
    const tFraction = tIndex - t0;
    const hFraction = hIndex - h0;
    const lowRow =
      (1 - hFraction) * emcValuesPercent[t0][h0] +
      hFraction * emcValuesPercent[t0][h1];
    const highRow =
      (1 - hFraction) * emcValuesPercent[t1][h0] +
      hFraction * emcValuesPercent[t1][h1];
    return {
      equilibriumMoisturePercent:
        (1 - tFraction) * lowRow + tFraction * highRow,
    };
  },
});
export const runEquilibriumMoistureLookup =
  equilibriumMoistureLookupTool.execute;
export default equilibriumMoistureLookupTool;
