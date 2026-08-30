import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LightingPowerDensityInput = Readonly<{
  readonly lightingWatts: number;
  readonly floorAreaSquareMeters: number;
}>;
export type LightingPowerDensityOutput = Readonly<{
  readonly wattsPerSquareMeter: number;
}>;

export const calculateLightingPowerDensity = (
  x: LightingPowerDensityInput,
): LightingPowerDensityOutput => {
  if (!Number.isFinite(x.lightingWatts) || x.lightingWatts < 0)
    simpleError("lightingWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.floorAreaSquareMeters) || x.floorAreaSquareMeters < 0)
    simpleError("floorAreaSquareMeters", "Provide a finite number at least 0.");
  const wattsPerSquareMeter = x.lightingWatts / x.floorAreaSquareMeters;
  if (!Number.isFinite(wattsPerSquareMeter))
    simpleError(
      "wattsPerSquareMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    wattsPerSquareMeter: Object.is(wattsPerSquareMeter, -0)
      ? 0
      : wattsPerSquareMeter,
  };
};

export const example = {
  input: { lightingWatts: 1000, floorAreaSquareMeters: 100 },
  output: { wattsPerSquareMeter: 10 },
} satisfies ToolExample<LightingPowerDensityInput, LightingPowerDensityOutput>;

export const tool = createSimpleTool({
  id: "engineering/lighting-power-density",
  title: "Lighting Power Density",
  description:
    "Installed lighting power density in watts per square meter of served floor area.",
  inputs: [
    {
      id: "lightingWatts",
      kind: "number",
      label: "Lighting Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "floorAreaSquareMeters",
      kind: "number",
      label: "Floor Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wattsPerSquareMeter",
      kind: "number",
      label: "Watts Per Square Meter",
      unit: "W/m²",
    },
  ],
  calculate: (input) =>
    calculateLightingPowerDensity({
      lightingWatts: input.lightingWatts as number,
      floorAreaSquareMeters: input.floorAreaSquareMeters as number,
    }),
});
export const lightingPowerDensityTool = tool;
export const runLightingPowerDensity = tool.execute;
export default tool;
