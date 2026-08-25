import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const caselayerDepthMoistureCalculatorExample = {
  input: { casingDepthMm: 50, trayAreaCm2: 1000 },
  output: { casingWaterMl: 3500 },
} satisfies ToolExample<
  {
    readonly casingDepthMm: number;
    readonly fieldCapacityFraction?: number;
    readonly trayAreaCm2: number;
  },
  {
    readonly casingWaterMl: number;
  }
>;

export const caselayerDepthMoistureCalculatorTool = createSimpleTool({
  id: "mycology/caselayer-depth-moisture-calculator",
  title: "Casing Moisture Calc",
  description:
    "Estimate casing layer water in milliliters as depth in millimeters times tray area in square centimeters times the field capacity fraction divided by ten.",
  inputs: [
    {
      id: "casingDepthMm",
      label: "Casing depth",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      id: "trayAreaCm2",
      label: "Tray area",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "cm²",
    },
    {
      default: 0.7,
      id: "fieldCapacityFraction",
      label: "Field capacity fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "casingWaterMl",
      label: "Casing water",
      kind: "number",
      minimum: 0,
      unit: "mL",
    },
  ],
  calculate: (input) => {
    const casingDepthMm = input.casingDepthMm as number;
    if (casingDepthMm <= 0)
      simpleError("casingDepthMm", "Casing depth must be greater than zero.");
    const trayAreaCm2 = input.trayAreaCm2 as number;
    if (trayAreaCm2 <= 0)
      simpleError("trayAreaCm2", "Tray area must be greater than zero.");
    const casingWaterMl =
      (casingDepthMm * trayAreaCm2 * (input.fieldCapacityFraction as number)) /
      10;
    if (!Number.isFinite(casingWaterMl))
      simpleError(
        "casingDepthMm",
        "The calculated water volume is too large to represent.",
      );
    return { casingWaterMl };
  },
});
export const runCaselayerDepthMoistureCalculator =
  caselayerDepthMoistureCalculatorTool.execute;
export default caselayerDepthMoistureCalculatorTool;
