import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tideGaugeBottomPressureHydrostaticDepthExample = {
  input: { pressurePa: 10000 },
  output: {
    waterDepthM: 0.9945053578976156,
    depthCentimeters: 99.45053578976156,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tideGaugeBottomPressureHydrostaticDepthTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ pressurePa, waterDensityKgM3 }) => {
      const density = waterDensityKgM3 ?? 1025;
      if (!(density > 0))
        simpleError("waterDensityKgM3", "Water density must be positive.");
      const h = pressurePa / (density * 9.81);
      return { waterDepthM: h, depthCentimeters: h * 100 };
    })(input as never) as Record<string, unknown>,
  description:
    "Convert bottom-pressure to equivalent sea-surface height via the hydrostatic relation h = p/(ρg).",
  id: "seismology/tide-gauge-bottom-pressure-hydrostatic-depth",
  inputs: [
    {
      minimum: 0,
      description: "Bottom pressure (total or residual).",
      id: "pressurePa",
      kind: "number",
      label: "p",
      unit: "Pa",
    },
    {
      default: 1025,
      description: "Seawater density.",
      id: "waterDensityKgM3",
      kind: "number",
      label: "ρ",
      unit: "kg/m³",
    },
  ],
  outputs: [
    {
      description: "Equivalent water depth.",
      id: "waterDepthM",
      kind: "number",
      label: "h",
      unit: "m",
    },
    {
      description: "Equivalent depth in centimeters.",
      id: "depthCentimeters",
      kind: "number",
      label: "h_cm",
      unit: "cm",
    },
  ],
  title: "Tide Gauge Bottom Pressure Hydrostatic Depth Converter",
});
export const runTideGaugeBottomPressureHydrostaticDepth =
  tideGaugeBottomPressureHydrostaticDepthTool.execute;
export { tideGaugeBottomPressureHydrostaticDepthExample as example };
export default tideGaugeBottomPressureHydrostaticDepthTool;
