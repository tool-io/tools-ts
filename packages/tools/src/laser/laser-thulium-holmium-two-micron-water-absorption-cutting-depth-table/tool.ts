import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterAbsorptionDepthInput = {
  readonly wavelengthNm?: number;
};

export type WaterAbsorptionDepthOutput = {
  readonly alphaWaterPerCm: number;
  readonly penetrationDepthMicrometers: number;
  readonly thermalConfinementTimeSeconds: number;
  readonly interpolated: boolean;
};

/** Thermal diffusivity of water in cm²/s. */
export const WATER_THERMAL_DIFFUSIVITY_CM2_S = 1.43e-3;

/** Base-e water absorption coefficients at common surgical wavelengths. */
export const WATER_ABSORPTION_TABLE: readonly {
  readonly alphaPerCm: number;
  readonly lambdaNm: number;
}[] = [
  { alphaPerCm: 0.005, lambdaNm: 532 },
  { alphaPerCm: 0.06, lambdaNm: 810 },
  { alphaPerCm: 0.5, lambdaNm: 980 },
  { alphaPerCm: 0.14, lambdaNm: 1064 },
  { alphaPerCm: 2.5, lambdaNm: 1320 },
  { alphaPerCm: 28, lambdaNm: 1470 },
  { alphaPerCm: 120, lambdaNm: 1908 },
  { alphaPerCm: 30, lambdaNm: 2090 },
  { alphaPerCm: 12000, lambdaNm: 2940 },
  { alphaPerCm: 800, lambdaNm: 10600 },
];

const logInterpolate = (
  xLow: number,
  yLow: number,
  xHigh: number,
  yHigh: number,
  x: number,
): number => {
  const t = Math.log(x / xLow) / Math.log(xHigh / xLow);
  return Math.exp(Math.log(yLow) + t * (Math.log(yHigh) - Math.log(yLow)));
};

export const waterAbsorptionAt = (wavelengthNm: number) => {
  if (wavelengthNm <= 0)
    simpleError("wavelengthNm", "Wavelength must be positive.");
  const table = WATER_ABSORPTION_TABLE;
  if (wavelengthNm < table[0].lambdaNm)
    simpleError(
      "wavelengthNm",
      `Wavelength must be at least ${table[0].lambdaNm} nm.`,
    );
  const last = table[table.length - 1];
  if (wavelengthNm > last.lambdaNm)
    simpleError(
      "wavelengthNm",
      `Wavelength must be at most ${last.lambdaNm} nm.`,
    );
  for (let i = 0; i < table.length - 1; i += 1) {
    const low = table[i];
    const high = table[i + 1];
    if (wavelengthNm === low.lambdaNm)
      return { alphaPerCm: low.alphaPerCm, interpolated: false };
    if (wavelengthNm > low.lambdaNm && wavelengthNm < high.lambdaNm)
      return {
        alphaPerCm: logInterpolate(
          low.lambdaNm,
          low.alphaPerCm,
          high.lambdaNm,
          high.alphaPerCm,
          wavelengthNm,
        ),
        interpolated: true,
      };
  }
  return { alphaPerCm: last.alphaPerCm, interpolated: false };
};

export const computeWaterCuttingDepth = (
  input: WaterAbsorptionDepthInput,
): WaterAbsorptionDepthOutput => {
  const wavelengthNm = input.wavelengthNm ?? 1940;
  const { alphaPerCm, interpolated } = waterAbsorptionAt(wavelengthNm);
  const depthCm = 1 / alphaPerCm;
  return {
    alphaWaterPerCm: alphaPerCm,
    penetrationDepthMicrometers: depthCm * 1e4,
    thermalConfinementTimeSeconds:
      (depthCm * depthCm) / WATER_THERMAL_DIFFUSIVITY_CM2_S,
    interpolated,
  };
};

export const waterAbsorptionDepthExample = {
  input: { wavelengthNm: 2090 },
  output: {
    alphaWaterPerCm: 30,
    penetrationDepthMicrometers: 10000 / 30,
    thermalConfinementTimeSeconds:
      (1 / 30) ** 2 / WATER_THERMAL_DIFFUSIVITY_CM2_S,
    interpolated: false,
  },
} satisfies ToolExample<WaterAbsorptionDepthInput, WaterAbsorptionDepthOutput>;

export const waterAbsorptionDepthTool = createSimpleTool({
  calculate: (input) =>
    computeWaterCuttingDepth({ wavelengthNm: input.wavelengthNm as number }),
  description:
    "Look up or interpolate the water absorption coefficient of a surgical laser wavelength and derive its optical penetration depth and thermal confinement time.",
  id: "laser/laser-thulium-holmium-two-micron-water-absorption-cutting-depth-table",
  inputs: [
    {
      description: "Surgical laser wavelength between the tabulated points.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      maximum: 10600,
      minimum: 532,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Base-e absorption coefficient of water.",
      id: "alphaWaterPerCm",
      kind: "number",
      label: "α_water",
      unit: "cm⁻¹",
    },
    {
      description: "Optical penetration depth (1/α) in micrometres.",
      id: "penetrationDepthMicrometers",
      kind: "number",
      label: "Penetration depth",
      unit: "µm",
    },
    {
      description: "Time for the heated layer to cool by conduction.",
      id: "thermalConfinementTimeSeconds",
      kind: "number",
      label: "Thermal confinement time",
      unit: "s",
    },
    {
      description: "True when log-log interpolation was required.",
      id: "interpolated",
      kind: "boolean",
      label: "Interpolated",
    },
  ],
  title: "Water Absorption & Cutting Depth Table",
});
export const runWaterAbsorptionDepth = waterAbsorptionDepthTool.execute;
export default waterAbsorptionDepthTool;

export { waterAbsorptionDepthExample as example };
